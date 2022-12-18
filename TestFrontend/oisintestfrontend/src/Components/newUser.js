import React, { useState } from "react";
import axios from "axios";

function NewUserForm() {
	const [file, setFile] = useState();

	const changeFile = (event) => {
		const file = event.target.files[0];
		setFile(file);
	};

	function formSubmission(event) {
		event.preventDefault();
		const name = event.target.name.value;
		const email = event.target.email.value;
		const password = event.target.password.value;
		const passwordConfirm = event.target.passwordConfirm.value;

		const formData = new FormData();
		formData.append("name", name);
		formData.append("email", email);
		formData.append("password", password);
		formData.append("passwordConfirm", passwordConfirm);
		formData.append("avatar", file);
		axios({
			method: "POST",
			url: "http://127.0.0.1:3000/api/users/createAccount",
			data: formData,
			headers: {
				"Content-Type": "multipart/form-data",
			},
		});
	}
	return (
		<form
			onSubmit={formSubmission}
			encType="multipart/form-data"
			id="propertyForm"
		>
			<label htmlFor="name">Name</label>
			<input type="text" name="name"></input>
			<br />

			<label htmlFor="email">email</label>
			<input type="email" name="email"></input>
			<br />

			<label htmlFor="password">password</label>
			<input
				type="password"
				id="password"
				name="password"
				minlength="8"
				required
			></input>
			<br />

			<label htmlFor="passwordConfirm">passwordConfirm</label>
			<input
				type="password"
				id="passwordConfirm"
				name="passwordConfirm"
				minLength="8"
				required
			></input>
			<br />

			<input type="file" accept="image/*" onChange={changeFile} />
			<br />
			<button type="submit">
				<h1>SUBMIT</h1>
			</button>
		</form>
	);
}

export default NewUserForm;
