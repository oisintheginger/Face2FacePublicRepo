/**
 * Using the Query modifier to allow for method chaining is a concept, and the pagination function are adapted from Jonas Schmedtmann's Udemy Course on Node.js.
 * The geo searching, price and features filtering are my own work
 * https://github.com/jonasschmedtmann/complete-node-bootcamp
 */
class ModifiedQuery {
	constructor(queryObject, reqString) {
		this.queryObject = queryObject;
		this.reqString = reqString;
	}
	filter() {
		let queryFilters = { ...this.reqString };
		[
			"fields",
			"page",
			"sortBy",
			"sortDirection",
			"thumbnail",
			"limit",
			"distance",
			"targetCoordinates",
		].forEach((el) => {
			delete queryFilters[el];
		});
		if (queryFilters.features) {
			let featuresList = queryFilters.features.split(",");
			queryFilters[`$expr`] = {
				$eq: [{ $setIsSubset: [[...featuresList], "$features"] }, true],
			};
			delete queryFilters.features;
		}
		if (queryFilters.addressSearch) {
			queryFilters["$text"] = {
				$search: queryFilters.addressSearch,
			};
			delete queryFilters.addressSearch;
		}
		if (this.reqString.distance && this.reqString.targetCoordinates) {
			const distance = parseFloat(this.reqString.distance); //kilometers
			const searchPoint = this.reqString.targetCoordinates
				.split(",")
				.map((el) => {
					return parseFloat(el);
				});
			queryFilters["address.coords"] = {
				$geoWithin: {
					$centerSphere: [searchPoint, (distance * 1.609) / 3963.2],
				},
			};
		}
		queryFilters["price"] = {
			$gt: +this.reqString.minPrice || 0,
			$lte: +this.reqString.maxPrice || 10000000,
		};
		this.reqString.minPrice ?? delete queryFilters.minPrice;
		this.reqString.maxPrice ?? delete queryFilters.maxPrice;
		this.query = this.queryObject.find(queryFilters);
		return this;
	}
	pagination() {
		const page = this.reqString.page * 1 || 1;
		const limit = this.reqString.limit * 1 || 100;
		const skip = (page - 1) * limit;
		this.queryObject = this.queryObject.skip(skip).limit(limit);
		return this;
	}

	selectFields(fieldparams) {
		const allowedSelectTerms = [
			"owner_id",
			"name",
			"price",
			"propertyCategory",
			"propertyType",
			"paymentFrequency",
			"bedroomCount",
			"address",
			"minimumLease",
			"availableFrom",
			"postcode",
			"features",
			"images",
			"description",
			"avatar",
		];
		if (fieldparams && typeof fieldparams == "string") {
			let fields = fieldparams.split(",").map((el) => {
				if (allowedSelectTerms.includes(el)) {
					return el;
				}
			});
			let selectObject = {};
			fields.forEach((param) => {
				selectObject[param] = 1;
			});
			this.queryObject = this.queryObject.select(selectObject);
		}
		return this;
	}
}

exports.default = ModifiedQuery;
