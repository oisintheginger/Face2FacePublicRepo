const mongoose = require("mongoose");
const { AddressSchema } = require("./addressModel.js");

const propertySchema = new mongoose.Schema(
	{
		owner_id: {
			type: String,
			required: [true, "Owner is Required"],
		},
		name: {
			type: String,
			required: [true, "Property Name is Required"],
			trim: true,
			maxLength: [50, "Property Name is limited to 50 characters in length."],
		},
		price: {
			type: Number,
			required: [true, "Price is Required"],
		},
		propertyCategory: {
			type: String,
			required: [true, "Property must have a category"],
			default: "rent",
			enum: ["rent", "shared"],
		},
		propertyType: {
			type: String,
			required: [true, "Property must have a type"],
			default: "house",
			enum: ["house", "apartment", "studio", "flat"],
		},
		paymentFrequency: {
			type: String,
			required: [true, "Property must have a payment frequency"],
			default: "property",
			enum: ["weekly", "monthly"],
		},
		bedroomCount: {
			type: Number,
			required: [true, "Property must have a bedroom count"],
			default: 1,
		},
		bathroomCount: {
			type: Number,
			required: [true, "Property must have a bathroom count"],
			default: 1,
		},
		address: AddressSchema,
		minimumLease: {
			type: Number,
			enum: [1, 3, 6, 12, 24, 36],
		},
		availableFrom: {
			type: Date,
			default: Date.now,
		},
		postcode: {
			type: String,
			required: true,
			unique: true,
		},
		features: [String],
		images: {
			image1: {
				type: String,
				default: null,
			},
			image2: {
				type: String,
				default: null,
			},
			image3: {
				type: String,
				default: null,
			},
			image4: {
				type: String,
				default: null,
			},
			image5: {
				type: String,
				default: null,
			},
			image6: {
				type: String,
				default: null,
			},
		},
		description: String,
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
/**
 * The index allows us to perform a text search for the address.
 */
propertySchema.index({
	"address.addressLine1": "text",
	"address.addressLine2": "text",
	"address.city": "text",
	"address.county": "text",
	"address.postcode": "text",
	"address.country": "text",
});

module.exports = mongoose.model("Property", propertySchema);
