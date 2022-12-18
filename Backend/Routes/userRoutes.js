const express = require("express");
const {
	getAllUsers,
	deleteUser,
	updateEmail,
	updateProfile,
	getAccountDetails,
	changePassword,
} = require("./../Controllers/userController.js");

const authenticator = require("./../Controllers/authenticator.js");
const router = express.Router();
const multer = require("multer");
const storageObject = multer.memoryStorage();
const uploadStorage = multer({
	storage: storageObject,
	fileFilter: function (req, file, callback) {
		const acceptedFormats = /jpeg|jpg|png|gif/;
		const mimetype = acceptedFormats.test(file.mimetype);
		if (mimetype) {
			return callback(null, true);
		} else {
			callback("Error: Images Only!");
		}
	},
});
/**
 * Using the authenticator middleware is a concept adapted from Jonas Schmedtmann's Udemy Course,
 * https://github.com/jonasschmedtmann/complete-node-bootcamp
 */

router.route("/updateEmail").patch(authenticator.protect, updateEmail);
router
	.route("/updateProfile")
	.patch(authenticator.protect, uploadStorage.single("avatar"), updateProfile);

router
	.route("/createAccount")
	.post(uploadStorage.single("avatar"), authenticator.createAccount);

router.route("/changePassword").patch(authenticator.protect, changePassword);

router.route("/forgotPassword").post(authenticator.forgotPassword);

router.route("/resetPassword").post(authenticator.resetPassword);

router.route("/login").post(authenticator.login);

router.route("/logout").post(authenticator.protect, authenticator.logout);

router.route("/MyAccount").get(authenticator.protect, getAccountDetails);

//#o GET RID OF WHEN PUBLISHING
router.route("/").get(getAllUsers);

router.route("/").delete(authenticator.protect, deleteUser);

module.exports = router;
