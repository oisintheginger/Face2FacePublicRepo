const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { PropertyInterest } = require("./interestedModel.js");
const Property = require("./../Models/propertyModel.js");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Username is Required"],
			trim: true,
			maxLength: [50, "User Name is limited to 50 characters in length."],
		},
		email: {
			type: String,
			unique: true,
			required: [true, "Email address is required for account creation"],
			validate: {
				validator: function (v) {
					return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
				},
				message: "Invalid email address",
			},
		},
		avatar: {
			type: String,
		},
		description: {
			type: String,
			maxLength: [500, "Description is limited to 500 characters in length."],
			default: "",
		},
		password: {
			type: String,
			required: [true, "A user must have a password."],
			trim: true,
			maxlength: [100, "A password must be within 100 characters."],
			minlength: [8, "A password must be at least 8 characters."],
			select: false,
		},
		passwordConfirm: {
			type: String,
			required: [true, "Please confirm your password"],
			select: false,
			validate: {
				validator: function (val) {
					return val === this.password;
				},
				message: "Passwords do not match",
			},
		},
		passwordChangedTime: {
			type: Date,
			select: false,
		},
		passwordResetToken: {
			type: String,
			select: false,
		},
		passwordResetExpires: {
			type: Date,
			select: false,
			default: Date.now(),
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

/**
 * Adapted from Jonas Schmedtmann's Udemy Course on Node.js.
 * https://github.com/jonasschmedtmann/complete-node-bootcamp
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 14);
	this.passwordConfirm = undefined;
	next();
});

userSchema.pre("remove", async function (next) {
	await Property.deleteMany({ owner_id: this._id });
	await PropertyInterest.deleteMany({
		$or: [{ interestedUserID: this._id }, { propertyOwnerID: this._id }],
	});
	next();
});
/**
 * Adapted from Jonas Schmedtmann's Udemy Course on Node.js.
 * https://github.com/jonasschmedtmann/complete-node-bootcamp
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
userSchema.methods.checkPassword = async function (candidate, uid) {
	const { password } = await User.findById(uid).select("+password");
	if (!password) {
		return false;
	}
	return await bcrypt.compare(candidate, password);
};

/**
 * Adapted from Jonas Schmedtmann's Udemy Course on Node.js.
 * https://github.com/jonasschmedtmann/complete-node-bootcamp
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
	if (this.passwordChangedTime) {
		const changedTimestamp = parseInt(
			this.passwordChangedTime.getTime() / 1000,
			10
		);
		console.log(changedTimestamp, JWTTimestamp);
		return JWTTimestamp < changedTimestamp;
	}
	return false;
};

userSchema.methods.createPasswordResetToken = function () {
	const resetToken = crypto.randomBytes(48).toString("hex");
	this.passwordResetToken = resetToken;
	this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
	return resetToken;
};

userSchema.methods.compareToken = function (candidateToken) {
	return (
		crypto.createHash("sha256").update(candidateToken).digest("hex") ==
		this.passwordResetToken
	);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
