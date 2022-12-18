const Property = require("./../Models/propertyModel.js");
const { AddressModel } = require("./../Models/addressModel.js");
const { PropertyInterest } = require("./../Models/interestedModel.js");
const { s3Get, s3Delete, FileUpload } = require("../Utils/s3Tools.js");
const { default: queryModifier } = require("./../Utils/queryModifier");
const CustomError = require("./../Utils/customError.js");

/**
 * Takes in an array of property documents, and converts their image names into valid s3 urls
 * @param {*} propertiesResultsArray An array of property Documents
 * @param {*} maxLimit The limit of documents we can fetch the images for
 * @returns {*} An array of modified property documents
 */
async function getPropertyImages(propertiesResultsArray, maxLimit = 100) {
	return await Promise.all(
		propertiesResultsArray.map(async (property) => {
			const propertyImageKeys = Object.keys(property.images);
			const imageUrls = await Promise.all(
				propertyImageKeys.map(async (imageKey, index) => {
					try {
						if (index < maxLimit) {
							const imageUrl = await s3Get(property.images[imageKey]);
							return imageUrl;
						} else {
							return null;
						}
					} catch (error) {
						return null;
					}
				})
			);
			const images = {};
			imageUrls.forEach((el, ind) => {
				images[`image${ind + 1}`] = el;
			});
			property.images = images;
			return property;
		})
	);
}

/**
 * Takes in a property document, and deletes its images from s3
 * @param {*} property An array of property Documents
 * @returns null
 */
async function deletePropertyImages(property) {
	const propertyImageKeys = Object.keys(property.images);
	try {
		await Promise.all(
			propertyImageKeys.map(async (imageKey) => {
				property.images[imageKey] &&
					(await s3Delete(property.images[imageKey]));
			})
		);
	} catch (error) {
		console.log(error.message);
	}
}

const sortfields = [
	"name",
	"price",
	"category",
	"bedroomCount",
	"bathroomCount",
	"availableFrom",
	"minimumLease",
];
/**
 * The function to get all properties. Accepts various request query parameters for filtering, sorting, pagination and field selection
 * @param {*} req The incoming request
 * @param {*} res The response object
 * @param {*} next The next function
 */
exports.getAllProperties = async (req, res, next) => {
	try {
		const propertyQuery = new queryModifier(Property.find(), req.query)
			.filter()
			.pagination()
			.selectFields(req.query.fields);
		const sortBy =
			req.query.sortBy && sortfields.includes(req.query.sortBy)
				? req.query.sortBy
				: "";
		let properties = await propertyQuery.queryObject.sort(
			`${
				req.query.sortDirection && req.query.sortDirection == "desc" ? "-" : ""
			}${sortBy}`
		);
		properties = await getPropertyImages(
			properties,
			req.query.thumbnail ? 1 : 5
		);

		res.status(200).json({
			status: "OK",
			success: true,
			results: properties ? properties.length : 0,
			data: {
				properties: properties,
			},
		});
	} catch (error) {
		res.status(error.errorCode || 500).json({
			status: error.message || "Internal Server Error",
			success: false,
			message: error.statusMessage || "Something Went Wrong on Our End",
			data: error.data || {},
		});
	}
};
/**
 * The function to get all properties owned by the users. Accepts request query parameters for pagination and field selection.
 * @param {*} req The incoming request
 * @param {*} res The response object
 * @param {*} next The next function
 */
exports.getMyProperties = async (req, res, next) => {
	try {
		const propertyQuery = new queryModifier(
			Property.find({ owner_id: req.user._id }),
			req.query
		)
			.pagination()
			.selectFields(req.query.fields);

		let properties = await propertyQuery.queryObject;
		properties = await getPropertyImages(
			properties,
			req.query.thumbnail ? 1 : 5
		);
		const length = properties ? properties.length : 0;
		res.status(200).json({
			status: "OK",
			success: true,
			results: length,
			data: {
				Properties: properties,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: "Internal Server Error",
			success: false,
			message: "failure",
			data: {},
		});
	}
};
/**
 * The function to get a single property. Supports parameters for field selection.
 * @param {*} req The incoming request
 * @param {*} res The response object
 * @param {*} next The next function
 */
exports.getPropertyById = async (req, res, next) => {
	try {
		let propID = req.body.propertyId ? req.body.propertyId : null;
		if (!propID) {
			propID = req.query.propertyId ? req.query.propertyId : null;
		}
		if (!propID) {
			throw new CustomError.default(
				"Bad Request",
				"No propertyId supplied",
				400
			);
		}
		let property = {};
		const propertyQuery = new queryModifier(
			Property.findById(propID),
			req.query
		).selectFields(req.query.fields);
		property = await propertyQuery.queryObject;
		if (!property) {
			throw new CustomError.default(
				"Not Acceptable",
				"No Property of that id found",
				406
			);
		}
		property = await getPropertyImages([property], req.query.thumbnail ? 1 : 5);
		res.status(200).json({
			status: "OK",
			success: true,
			data: {
				propertyData: property[0],
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

const acceptedFeatures = [
	"furnished",
	"wifi",
	"heating",
	"dishwasher",
	"washing_machine",
	"dryer",
	"alarm",
	"cable",
	"pets",
	"parking",
	"serviced",
	"wheelchair",
];
/**
 * The function creating a new property. Information for new property is received through the request body. The property image files are caught by multer middleware and attached to the req.files array
 * @param {*} req The incoming request
 * @param {*} res The response object
 * @param {*} next The next function
 */
exports.createProperty = async (req, res, next) => {
	try {
		if (
			!req.body.propertyAddress ||
			!req.body.propertyName ||
			!req.body.propertyPrice ||
			!req.body.propertyCategory ||
			!req.body.propertyType ||
			!req.body.paymentFrequency ||
			!req.body.bathroomCount ||
			!req.body.bedroomCount
		) {
			throw new CustomError.default(
				"Unprocessable Entity",
				"Incorrect data supplied",
				422
			);
		}
		const [
			addressLine1 = "",
			addressLine2 = "",
			city = "",
			county,
			postcode,
			country,
		] = [...req.body.propertyAddress.split(",")];

		const propertyFeatures = req.body.propertyFeatures
			? req.body.propertyFeatures
					.split(",")
					.filter((el) => acceptedFeatures.includes(el))
			: [];
		let propertyImageNames = [];
		if (req.files && req.files.propertyImages) {
			for (const f of req.files.propertyImages) {
				try {
					const newImageName = await FileUpload(f);
					propertyImageNames.push(newImageName);
				} catch (error) {
					throw new CustomError.default(
						"Internal Server Error",
						"Failed to upload image",
						500
					);
				}
			}
		}

		const propertyImages = {};
		propertyImageNames.forEach((el, ind) => {
			propertyImages[`image${ind + 1}`] = el;
		});

		const coords =
			req.body.longitude && req.body.latitude
				? [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
				: [0, 0];

		let newAddress = {};
		try {
			newAddress = await AddressModel.create({
				addressLine1: addressLine1,
				addressLine2: addressLine2,
				city: city,
				county: county,
				postcode: postcode,
				country: country,
				coords: { type: "Point", coordinates: coords },
			});
		} catch (error) {
			throw new CustomError.default(
				"Bad Request",
				"failed to create new address",
				400
			);
		}

		let newProperty = {};
		try {
			newProperty = await Property.create({
				owner_id: req.user._id,
				name: req.body.propertyName,
				price: req.body.propertyPrice,
				address: newAddress,
				propertyCategory: req.body.propertyCategory,
				propertyType: req.body.propertyType,
				paymentFrequency: req.body.paymentFrequency,
				bedroomCount: req.body.bedroomCount,
				bathroomCount: req.body.bathroomCount,
				availableFrom: req.body.availableFrom,
				images: propertyImages,
				features: propertyFeatures,
				description: req.body.description,
				postcode: postcode,
			});
		} catch (error) {
			newAddress.deleteOne();
			throw new CustomError.default(
				"Bad Request",
				"failed to create new property",
				400
			);
		}
		res.status(201).json({
			status: "Created",
			success: true,
			message: "successfully registered new property",
			data: {
				property: newProperty,
			},
		});
	} catch (error) {
		console.log(error.message);
		res.status(error.errorCode || 500).json({
			status: error.customMessage || "Internal Server Error",
			success: false,
			message: error.statusMessage || "Something Went Wrong on Our End",
			data: error.data || {},
		});
	}
};
/**
 * Allows for the deletion of properties
 * @param {*} req The incoming request
 * @param {*} res The response object
 * @param {*} next The next function
 */
exports.deleteProperty = async (req, res, next) => {
	try {
		const property = await Property.findById(req.body.propertyId);
		if (!property) {
			throw new CustomError.default(
				"Not Acceptable",
				"No Property of that id found",
				406
			);
		}
		if (property.owner_id == req.user._id) {
			deletePropertyImages(property);
			await AddressModel.findByIdAndDelete(property.address._id);
			await PropertyInterest.deleteMany({ propertyID: property.id });
			await property.deleteOne();
		}
		res.status(204).json({
			status: "OK",
			success: true,
			message: "Successfully deleted property",
			data: {},
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

/**
 * Update function for properties. Image files are caught by multer middleware and attached to the req.files
 * @param {*} req The incoming request
 * @param {*} res The response object
 * @param {*} next The next function
 */
exports.updateProperty = async (req, res, next) => {
	try {
		if (!req.body.propertyId) {
			throw new CustomError.default(
				"Unprocessable Entity",
				"No propertyId supplied",
				422
			);
		}
		let property = {};
		try {
			property = await Property.findById(req.body.propertyId);
		} catch (error) {
			throw new CustomError.default(
				"Not Acceptable",
				"No property exists with supplied id",
				406
			);
		}
		if (property.owner_id != req.user._id) {
			throw new CustomError.default(
				"Unauthorized",
				"You are not the owner of this property",
				401
			);
		}
		let objectImages = {};
		try {
			objectImages = {
				...(req.files &&
					req.files.image1 && {
						image1: await FileUpload(
							req.files.image1[0],
							property.images.image1
						),
					}),
				...(req.files &&
					req.files.image2 && {
						image2: await FileUpload(
							req.files.image2[0],
							property.images.image2
						),
					}),
				...(req.files &&
					req.files.image3 && {
						image3: await FileUpload(
							req.files.image3[0],
							property.images.image3
						),
					}),
				...(req.files &&
					req.files.image4 && {
						image4: await FileUpload(
							req.files.image4[0],
							property.images.image4
						),
					}),
				...(req.files &&
					req.files.image5 && {
						image5: await FileUpload(
							req.files.image5[0],
							property.images.image5
						),
					}),
				...(req.files &&
					req.files.image6 && {
						image6: await FileUpload(
							req.files.image6[0],
							property.images.image6
						),
					}),
			};
		} catch (error) {
			throw new CustomError.default(
				"Internal Server Error",
				"failed to upload image",
				500
			);
		}

		const mergedImages = Object.assign({}, property.images, objectImages);
		function addressObjectFromRequestBody(requestBody) {
			return {
				addressLine1: requestBody?.addressLine1 || "",
				addressLine2: requestBody?.addressLine2 || "",
				city: requestBody.city || "",
				...(requestBody.county && {
					county: requestBody.county,
				}),
				...(requestBody.postcode && {
					postcode: requestBody.postcode,
				}),
				...(requestBody.country && {
					country: requestBody.country,
				}),
				...(requestBody.longitude &&
					requestBody.latitude &&
					parseFloat(requestBody.longitude) &&
					parseFloat(requestBody.latitude) && {
						coords: {
							type: "Point",
							coordinates: [
								parseFloat(requestBody.longitude),
								parseFloat(requestBody.latitude),
							],
						},
					}),
			};
		}

		let address = await AddressModel.findById(property.address._id);

		try {
			const newAddress = addressObjectFromRequestBody(req.body);
			const newObj = Object.assign(address, newAddress);
			address = newObj;
			address.save();
			property.postcode = address.postcode;
		} catch (error) {
			throw new CustomError.default(
				"Internal Server Error",
				"failed to update address",
				500
			);
		}

		function propertyObjectFromRequestBody(requestBody) {
			return {
				...(requestBody.propertyName && { name: requestBody.propertyName }),
				...(requestBody.propertyPrice &&
					!isNaN(parseFloat(requestBody.propertyPrice)) && {
						price: parseFloat(requestBody.propertyPrice),
					}),
				...(requestBody.propertyCategory && {
					propertyCategory: requestBody.propertyCategory,
				}),
				...(requestBody.propertyType && {
					propertyType: requestBody.propertyType,
				}),
				...(requestBody.paymentFrequency && {
					paymentFrequency: requestBody.paymentFrequency,
				}),
				...(requestBody.bedroomCount &&
					!isNaN(parseFloat(requestBody.bedroomCount)) && {
						bedroomCount: parseFloat(requestBody.bedroomCount),
					}),
				...(requestBody.bathroomCount &&
					!isNaN(parseFloat(requestBody.bathroomCount)) && {
						bathroomCount: parseFloat(requestBody.bathroomCount),
					}),
				...(requestBody.minimumLease &&
					!isNaN(parseFloat(requestBody.minimumLease)) && {
						minimumLease: parseFloat(requestBody.minimumLease),
					}),
				...(requestBody.availableFrom &&
					new Date(requestBody.availableFrom) instanceof Date &&
					!isNaN(new Date(requestBody.availableFrom).valueOf()) && {
						availableFrom: new Date(requestBody.availableFrom),
					}),
				...(requestBody.description && {
					description: requestBody.description,
				}),
				images: mergedImages,
				...(address && {
					address: address,
				}),
				...(address && {
					postcode: address.postcode,
				}),
			};
		}

		try {
			property = Object.assign(
				property,
				propertyObjectFromRequestBody(req.body)
			);
			property.save();
		} catch (error) {
			console.log(error, "proprt err");
			throw new CustomError.default(
				"Internal Server Error",
				"Error updating property",
				500
			);
		}

		res.status(200).json({
			status: 200,
			data: {
				property: property,
			},
			message: "Success",
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
