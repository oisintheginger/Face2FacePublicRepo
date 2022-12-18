const mongoose = require("mongoose");
const PropertyInterestSchema = new mongoose.Schema({
	propertyID: {
		type: String,
		required: true,
	},
	interestedUserID: {
		type: String,
		required: true,
	},
	propertyOwnerID: {
		type: String,
		required: true,
	},
	interestStatus: {
		type: Number,
		default: 0,
		enum: [0, 1, 2],
	},
});

PropertyInterestSchema.index(
	{ propertyID: 1, interestedUserID: 1, propertyID: 1 },
	{ unique: true }
);

const PropertyInterest = new mongoose.model(
	"PropertyInterest",
	PropertyInterestSchema
);

module.exports.PropertyInterestSchema = PropertyInterestSchema;
module.exports.PropertyInterest = PropertyInterest;
