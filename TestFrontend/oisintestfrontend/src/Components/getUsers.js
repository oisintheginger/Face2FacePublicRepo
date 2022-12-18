import React, { useState } from "react";
import axios from "axios";
import RenderList from "./renderUsers.js";
function ListUsers() {
	const [users, setUsers] = useState([]);
	const [searchString, setSearchString] = useState("page=1&limit=25");
	async function getUsers(event) {
		event.preventDefault();
		const results = await axios({
			method: "GET",
			url: `http://127.0.0.1:3000/api/users?${searchString}`,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});

		setUsers(results.data.data.users);
	}
	return (
		<div>
			<button onClick={getUsers}>GET ALL USers</button>
			<RenderList results={users} />
		</div>
	);
}

export default ListUsers;
