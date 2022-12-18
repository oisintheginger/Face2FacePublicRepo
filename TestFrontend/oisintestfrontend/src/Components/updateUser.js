import React, { useState } from "react";
import axios from "axios";

function UpdateUser() {
	async function submitNewEmail(event) {
		event.preventDefault();
		const formData = new FormData();
		const authorization = event.target.authorization.value;
		const email = event.target.email.value;
		formData.append("email", email);
		const data = await axios({
			method: "PATCH",
			url: " http://127.0.0.1:3000/api/users/updateEmail",
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
				authorization: authorization,
			},
		});
		console.log(data);
	}
	async function submitChangePassword(event) {
		event.preventDefault();
		const headers = {};
		const authorization = event.target.authorization.value;
		headers["Access-Control-Allow-Origin"] = "*";
		headers["authorization"] = authorization;
		await axios({
			method: "PATCH",
			url: "http://127.0.0.1:3000/api/users/changePassword",
			withCredentials: false,
			data: {
				password: event.target.password.value,
				newPassword: event.target.newPassword.value,
				newPasswordConfirm: event.target.newPassword.value,
			},
			headers: { ...headers },
		});
	}

	return (
		<div>
			<form onSubmit={submitNewEmail}>
				<label htmlFor="authorization">JWT Authorization Token</label>
				<input type="text" name="authorization" id="authorization"></input>
				<br />
				<label htmlFor="email">New User Email</label>
				<input type="text" name="email" id="email"></input>
				<br />
				<button type="submit">
					<h1>SUBMIT Updates</h1>
				</button>
			</form>
			<br />
			<br />
			<br />

			<form onSubmit={submitChangePassword}>
				<label htmlFor="authorization">JWT Authorization Token</label>
				<input type="text" name="authorization" id="authorization"></input>
				<label htmlFor="password">CurrentPassword</label>
				<input type="text" name="password" id="password"></input>
				<br />
				<label htmlFor="newPassword">New Password</label>
				<input type="text" name="newPassword" id="newPassword"></input>
				<br />
				<button type="submit">
					<h1>SUBMIT Updates</h1>
				</button>
			</form>
		</div>
	);
}

export default UpdateUser;
