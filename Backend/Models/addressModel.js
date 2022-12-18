const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
	addressLine1: {
		type: String,
	},
	addressLine2: {
		type: String,
	},
	city: {
		type: String,
	},
	county: {
		type: String,
		required: true,
	},
	postcode: {
		type: String,
	},
	country: {
		type: String,
		required: true,
	},
	coords: {
		type: {
			type: String,
			enum: ["Point"],
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
});

const Address = mongoose.model("Address", addressSchema);
exports.AddressSchema = addressSchema;
exports.AddressModel = Address;
