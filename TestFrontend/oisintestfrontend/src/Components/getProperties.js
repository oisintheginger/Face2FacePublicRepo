import React, { useState } from "react";
import axios from "axios";
import RenderList from "./renderProperties.js";
function ListProperties() {
	const [properties, setProperties] = useState([]);
	const [searchString, setSearchString] = useState("page=1&limit=25");
	async function getProperties(event) {
		event.preventDefault();
		const results = await axios({
			method: "GET",
			url: `http://127.0.0.1:3000/api/properties?${searchString}`,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		setProperties(results.data.data.properties);
	}
	return (
		<div>
			<button onClick={getProperties}>GET ALL PROPERTIES</button>
			<RenderList results={properties} />
		</div>
	);
}

export default ListProperties;
