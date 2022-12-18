const express = require("express");
const {
	getAllProperties,
	createProperty,
	deleteProperty,
	getMyProperties,
	updateProperty,
	getPropertyById,
} = require("./../Controllers/propertyController.js");
const {
	registerInterest,
	getInterests,
	getInterestsOnProperties,
	sendInviteToInterestedUser,
	rejectInterest,
	getInterestedUsersOfProperty,
} = require("./../Controllers/interestedController.js");
const authenticator = require("./../Controllers/authenticator.js");
const router = express.Router();
const multer = require("multer");
const storageObject = multer.memoryStorage();
const multi_upload = multer({
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

const property_upload = multi_upload.fields([
	{ name: "propertyImages", maxCount: 6 },
]);

/**
 * Using the authenticator middleware is a concept adapted from Jonas Schmedtmann's Udemy Course,
 * https://github.com/jonasschmedtmann/complete-node-bootcamp
 */
router
	.route("/createProperty")
	.post(authenticator.protect, property_upload, createProperty);

router.route("/deleteProperty").delete(authenticator.protect, deleteProperty);

router.route("/").get(getAllProperties);

router.route("/propertyByID").get(getPropertyById);

router.route("/MyOwnedProperties").get(authenticator.protect, getMyProperties);

router.route("/registerInterest").post(authenticator.protect, registerInterest);

router.route("/myInterests").get(authenticator.protect, getInterests);

const property_update_images = multi_upload.fields([
	{ name: "image1", maxCount: 1 },
	{ name: "image2", maxCount: 1 },
	{ name: "image3", maxCount: 1 },
	{ name: "image3", maxCount: 1 },
	{ name: "image4", maxCount: 1 },
	{ name: "image5", maxCount: 1 },
	{ name: "image6", maxCount: 1 },
]);

router
	.route("/editProperty")
	.patch(authenticator.protect, property_update_images, updateProperty);

router
	.route("/propertyInterests")
	.get(authenticator.protect, getInterestsOnProperties);

router
	.route("/getUsersInterestedInProperty")
	.get(authenticator.protect, getInterestedUsersOfProperty);

router
	.route("/sendInterestInvitation")
	.post(authenticator.protect, sendInviteToInterestedUser);

router.route("/rejectInterest").post(authenticator.protect, rejectInterest);

module.exports = router;
