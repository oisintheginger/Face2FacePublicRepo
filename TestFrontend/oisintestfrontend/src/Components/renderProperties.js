import React from "react";

function PropertyList(params) {
	// let convertedKeys = params.results ? Object.keys(params.results[0]) : []
	let imageIndex = 0;
	let convertedResults = params.results.map((result) => {
		console.log(result);
		imageIndex = Object.keys(result).indexOf("images");
		return [...Object.values(result)];
	});

	function tableColumns(obj) {
		return Object.keys(obj).map((elem) => {
			if (elem == "images") {
				console.log("heeeeeeeerrr");
				return (
					<td>
						{obj[elem].map((url) => {
							return <img src={`${url}`} width="100px"></img>;
						})}
					</td>
				);
			}
			if (typeof obj[elem] == "object") {
				let val = Object.values(obj[elem]).join(",");
				return <td>{val}</td>;
			}
			console.log(elem);
			return <td>{obj[elem]}</td>;
		});
	}

	// console.log(convertedTable);
	return (
		<div>
			<table>
				<tbody>
					<tr>
						{/* {convertedKeys.map((el) => {
						return <td>{el}</td>;
					})} */}
						<td>Property ID</td>
						<td>Owner ID</td>
						<td>Name</td>
						<td>Price</td>
						<td>Category</td>
						<td>Type</td>
						<td>paymentFrequency</td>
						<td>Bathrooms</td>
						<td>Bedrooms</td>
						<td>Address</td>
						<td>Date Available</td>
						<td>Features</td>
						<td>Images</td>
						<td>_v</td>
						<td>_id</td>
					</tr>
					{params.results.map((el, ind) => {
						return <tr>{tableColumns(el)}</tr>;
					})}
				</tbody>
			</table>
		</div>
	);
}

export default PropertyList;
