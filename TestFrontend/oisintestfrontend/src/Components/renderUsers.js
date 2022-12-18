import React from "react";

function UserList(params) {
	// let convertedKeys = params.results ? Object.keys(params.results[0]) : []
	let imageIndex = 0;
	let convertedResults = params.results.map((result) => {
		console.log(result);
		imageIndex = Object.keys(result).indexOf("images");
		return [...Object.values(result)];
	});

	function tableColumns(obj) {
		return Object.keys(obj).map((elem) => {
			if (elem == "avatar") {
				console.log("heeeeeeeerrr");
				return (
					<td>
						{console.log(elem)}
						<img src={obj[elem]} width="100px"></img>;
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
					{params.results.map((el, ind) => {
						return <tr>{tableColumns(el)}</tr>;
					})}
				</tbody>
			</table>
		</div>
	);
}

export default UserList;
