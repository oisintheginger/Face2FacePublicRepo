const User = require("./../Models/userModel.js");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const { SendEmail } = require("./../Utils/emailService.js");
const CustomError = require("./../Utils/customError.js");
const { FileUpload, s3Get } = require("../Utils/s3Tools.js");
/**
 * Generates a jwt from the user document id
 * @param {*} uid the ID of the user
 * @returns
 */
const signToken = (uid) => {
	return jwt.sign({ id: uid }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};
/**
 * Generates a jwt from the user reset token
 * @param {*} randomString encrypts the randomized token. This encrypted token is then sent to the users email address.
 * @returns
 */
const resetToken = async (randomString) => {
	return jwt.sign(
		{ passwordResetToken: randomString },
		process.env.JWT_SECRET,
		{
			expiresIn: "12h",
		}
	);
};
/**
 * Creates a new account from the request body. The user avatar is caught by multer middleware and attached to the req as req.file. Image then uploaded to s3.
 * @param {*} req The incoming request
 * @param {*} res The response object
 * @param {*} next The next function
 */
exports.createAccount = async (req, res, next) => {
	try {
		console.log(req.file);
		let avatar = "";
		if (req.file) {
			avatar = await FileUpload(req.file);
		}
		if (
			!req.body.name ||
			!req.body.email ||
			!req.body.password ||
			!req.body.passwordConfirm
		) {
			throw new CustomError.default(
				"Bad Request",
				"Required Fields Not Supplied",
				400
			);
		}
		try {
			const newAccount = await User.create({
				name: req.body.name,
				email: req.body.email,
				avatar: avatar,
				password: req.body.password,
				passwordConfirm: req.body.passwordConfirm,
			});
			const returnData = {
				name: newAccount.name,
				id: newAccount._id,
				email: newAccount.email,
				avatar: await s3Get(avatar),
			};
			const token = signToken(newAccount._id);
			res.status(201).json({
				status: "success",
				success: true,
				data: {
					token: token,
					user: returnData,
				},
			});
		} catch (error) {
			throw new CustomError.default(
				"Bad Request",
				"Failed to make new account with entered fields",
				400
			);
		}
	} catch (error) {
		res.status(error.errorCode || 500).json({
			status: error.customMessage || "Internal Server Error",
			success: false,
			message: error.statusMessage || "Something Went Wrong on Our End",
			data: error.data || {},
		});
	}
};
/**
 * Adapted from Jonas Schmedtmann's Udemy Course on Node.js.
 * https://github.com/jonasschmedtmann/complete-node-bootcamp
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			throw new CustomError.default(
				"Bad Request",
				"No Email or Password Supplied",
				400
			);
		}
		const user = await User.findOne({ email: email }).select("+password");
		if (!user || !(await user.checkPassword(password, user.id))) {
			throw new CustomError.default(
				"Not Authorized",
				"Incorrect Email or Password Supplied",
				401
			);
		}
		let avatar = "";
		if (user.avatar) {
			avatar = await s3Get(user.avatar);
		}
		const token = signToken(user._id);
		const returnData = {
			name: user.name,
			id: user._id,
			email: user.email,
			avatar: await s3Get(avatar),
		};
		res.status(200).json({
			status: "success",
			success: true,
			data: {
				token: token,
				user: returnData,
			},
		});
	} catch (error) {
		res.status(error.errorCode || 500).json({
			status: error.customMessage || "Internal Server Error",
			success: false,
			message: error.statusMessage || "Something Went Wrong on Our End",
			data: error.data || {},
		});
	}
};

exports.logout = async (req, res, next) => {
	await User.findByIdAndUpdate(req.user._id, {
		passwordChangedTime: Date.now(),
	});
	res.status(200).json({
		status: "OK",
		success: true,
		data: {},
	});
};

/**
 * Adapted from Jonas Schmedtmann's Udemy Course on Node.js.
 * https://github.com/jonasschmedtmann/complete-node-bootcamp
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.protect = async (req, res, next) => {
	try {
		let token;
		if (req.headers.authorization) {
			token = req.headers.authorization;
		}
		if (!token) {
			throw new CustomError.default(
				"Not Authorized",
				"No authorization token supplied",
				401
			);
		}
		const decodedId = await promisify(jwt.verify)(
			token,
			process.env.JWT_SECRET
		);
		const freshUser = await User.findById(decodedId.id).select(
			"+passwordChangedTime"
		);
		if (!freshUser) {
			throw new CustomError.default(
				"Bad Request",
				"The user belonging to this token no longer exists.",
				400
			);
		}
		if (freshUser.changedPasswordAfter(decodedId.iat)) {
			throw new CustomError.default("Bad Request", "Please Login Again.", 400);
		}
		let avatar = "";
		if (freshUser.avatar) {
			avatar = await s3Get(freshUser.avatar);
		}
		req.user = freshUser;
		req.avatarName = freshUser.avatar;
		req.user.avatar = avatar;
		next();
	} catch (error) {
		res.status(error.errorCode || 400).json({
			status: error.customMessage || "Validation Error",
			success: false,
			message: error.statusMessage || "Something Went Wrong on Our End",
			data: error.data || {},
		});
	}
};

exports.forgotPassword = async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (user) {
		const token = user.createPasswordResetToken();
		const encodedToken = await resetToken(token);
		console.log(encodedToken);
		const emailContent = {
			target: user.email,
			subject: "Password Reset Token",
			payload: encodedToken,
		};
		SendEmail(emailContent);
		user.save();
	}
	res.status(200).json({
		status: "Ok",
		success: true,
		message:
			"Password Request Received. If account exists, token will be sent to the associated account email address",
	});
};

exports.resetPassword = async (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			throw new CustomError.default(
				"Not Authorized",
				"No authorization token supplied",
				401
			);
		}
		if (!req.body.password || !req.body.passwordConfirm) {
			throw new CustomError.default("Bad Request", "Invalid Parameters", 400);
		}
		const token = req.headers.authorization;
		const decodedToken = await promisify(jwt.verify)(
			token,
			process.env.JWT_SECRET
		);
		if (!decodedToken) {
			throw new CustomError.default("Bad Request", "Invalid Token", 400);
		}

		const user = await User.findOne({
			passwordResetToken: decodedToken.passwordResetToken,
		}).select("+passwordResetToken +password");
		if (!user) {
			throw new CustomError.default("Bad Request", "Invalid Token", 400);
		}
		if (req.body.password != req.body.passwordConfirm) {
			throw new CustomError.default(
				"Bad Request",
				"Passwords do not match",
				400
			);
		}
		user.password = req.body.password;
		user.passwordResetToken = crypto.randomBytes(64).toString("hex");
		user.passwordChangedTime = Date.now();
		await user.save();
		res.status(200).json({
			status: "OK",
			success: true,
			message: "Password Successfully Reset",
		});
	} catch (error) {
		res.status(error.errorCode || 400).json({
			status: error.customMessage || "Validation Error",
			success: false,
			message: error.statusMessage || "Something Went Wrong on Our End",
			data: error.data || {},
		});
	}
};
