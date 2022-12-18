import React from "react";
import axios from "axios";
function NewPropertyForm() {
	const date = new Date();
	const min_date = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
	function formSubmission(event) {
		event.preventDefault();
		const name = event.target.propertyName.value;

		const address = [
			event.target.addressline1.value,
			event.target.addressline2.value,
			event.target.city.value,
			event.target.county.value,
			event.target.postcode.value,
			event.target.country.value,
		].join(",");
		const price = Number(event.target.propertyPrice.value);
		const propertyCategory = event.target.propertyCategory.value;
		const paymentFrequency = event.target.paymentFrequency.value;
		const propertyType = event.target.propertyType.value;
		const bedroomCount = Number(event.target.bedroomCount.value);
		const bathroomCount = Number(event.target.bathroomCount.value);
		const availableFrom = event.target.availableFrom.value;
		const propertyImages = event.target.propertyImages.files;
		const coordinates = "53,100";

		let propertyFeatures = [];
		["washingmachine", "wifi", "television"].forEach((el) => {
			if (event.target[el] && event.target[el].checked) {
				propertyFeatures.push(el);
			}
		});

		const formData = new FormData();
		formData.append("propertyName", name);
		formData.append("propertyAddress", address);
		formData.append("propertyPrice", price);
		formData.append("propertyCategory", propertyCategory);
		formData.append("paymentFrequency", paymentFrequency);
		formData.append("propertyType", propertyType);
		formData.append("bedroomCount", bedroomCount);
		formData.append("bathroomCount", bathroomCount);
		formData.append("availableFrom", availableFrom);
		formData.append("propertyCoordinates", coordinates);
		formData.append("propertyFeatures", propertyFeatures);
		for (let f of propertyImages) {
			formData.append("propertyImages", f);
		}
		axios({
			method: "POST",
			url: " http://127.0.0.1:3000/api/properties/createProperty",
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
				authorization: event.target.authorization.value,
			},
		});
	}
	return (
		<form
			onSubmit={formSubmission}
			encType="multipart/form-data"
			id="propertyForm"
		>
			<label htmlFor="propertyName">Name</label>
			<input type="text" name="propertyName"></input>
			<br />
			<label htmlFor="authorization">authorization code</label>
			<br />
			<input type="text" name="authorization"></input>
			<br />
			<fieldset form="propertyForm" id="address">
				<legend>Address</legend>
				<label htmlFor="addressline1">Address Line 1</label>
				<input type="text" id="addressline1" name="addressline1"></input>
				<br />
				<label htmlFor="addressline2">Address Line 2</label>
				<input type="text" id="addressline2" name="addressline2"></input>
				<br />
				<label htmlFor="city">city</label>
				<input type="text" id="city" name="city"></input>
				<br />
				<label htmlFor="county">county</label>
				<input type="text" id="county" name="county"></input>
				<br />
				<label htmlFor="postcode">postcode</label>
				<input type="text" id="postcode" name="postcode"></input>
				<br />
				<label htmlFor="country">country</label>
				<input type="text" id="country" name="country"></input>
			</fieldset>
			<label htmlFor="propertyPrice">Price</label>
			<input type="number" min="100" step="0.1" name="propertyPrice"></input>
			<br />
			<label htmlFor="paymentFrequency">paymentFrequency</label>
			<select id="paymentFrequency" name="paymentFrequency">
				<option value="weekly">Weekly</option>
				<option value="monthly">Monthly</option>
			</select>
			<br />
			<label htmlFor="propertyCategory">propertyCategory</label>
			<select id="propertyCategory" name="propertyCategory">
				<option value="shared">Shared</option>
				<option value="property">Property</option>
			</select>
			<br />
			<label htmlFor="propertyType">propertyType</label>
			<select id="propertyType" name="propertyType">
				<option value="apartment">Apartment</option>
				<option value="house">House</option>
				<option value="Studio">Studio</option>
				<option value="Flat">Flat</option>
			</select>
			<br />
			<label htmlFor="bedroomCount">bedroomCount</label>
			<input
				type="number"
				min="1"
				name="bedroomCount"
				id="bedroomCount"
			></input>
			<br />
			<label htmlFor="bathroomCount">bathroomCount</label>
			<input
				type="number"
				min="1"
				name="bathroomCount"
				id="bathroomCount"
			></input>
			<br />
			<fieldset form="propertyForm" id="features">
				<legend>Features</legend>
				<label htmlFor="washingmachine">Washing Machine</label>
				<input
					type="checkbox"
					id="washingmachine"
					name="washingmachine"
					value="washingmachine"
				></input>
				<br />
				<label htmlFor="wifi">WiFi</label>
				<input type="checkbox" id="wifi" name="wifi" value="wifi"></input>
			</fieldset>
			<label htmlFor="availableFrom">availableFrom</label>
			<input
				type="date"
				min={min_date}
				name="availableFrom"
				id="availableFrom"
			></input>
			<br />
			<input
				type="file"
				multiple="multiple"
				accept="image/*"
				name="propertyImages"
				id="file"
			/>
			<br />
			<button type="submit">
				<h1>SUBMIT</h1>
			</button>
		</form>
	);
}

export default NewPropertyForm;
