import React, { useState } from "react";
import axios from "axios";

function UpdatePropertyImagesForm() {
	function submitForm(event) {
		event.preventDefault();
		const formData = new FormData();
		const authorization = event.target.authorization.value;
		const propertyId = event.target.propertyId.value;
		formData.append("propertyId", propertyId);
		formData.append("image1", event.target.image1.files[0]);
		formData.append("image2", event.target.image2.files[0]);
		formData.append("image3", event.target.image3.files[0]);
		formData.append("image4", event.target.image4.files[0]);
		formData.append("image5", event.target.image5.files[0]);
		formData.append("image6", event.target.image6.files[0]);

		formData.append("addressLine1", event.target.addressline1.value);
		formData.append("addressLine2", event.target.addressline2.value);
		formData.append("city", event.target.city.value);
		formData.append("county", event.target.county.value);
		formData.append("postcode", event.target.postcode.value);
		formData.append("country", event.target.country.value);

		axios({
			method: "PATCH",
			url: " http://127.0.0.1:3000/api/properties/editProperty",
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
				authorization: authorization,
			},
		});
	}

	return (
		<form onSubmit={submitForm}>
			<label htmlFor="authorization">authorization code</label>
			<br />
			<input type="text" name="authorization"></input>
			<br />
			<label htmlFor="propertyId">propertyId</label>
			<br />
			<input type="text" name="propertyId"></input>
			<br />
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
			<br />
			<input type="file" accept="image/*" name="image1" id="image1" />
			<br />
			<input type="file" accept="image/*" name="image2" id="image2" />
			<br />
			<input type="file" accept="image/*" name="image3" id="image3" />
			<br />
			<input type="file" accept="image/*" name="image4" id="image4" />
			<br />
			<input type="file" accept="image/*" name="image5" id="image5" />
			<br />
			<input type="file" accept="image/*" name="image6" id="image6" />
			<br />

			<br />

			<button type="submit">
				<h1>SUBMIT Updates</h1>
			</button>
		</form>
	);
}

export default UpdatePropertyImagesForm;
