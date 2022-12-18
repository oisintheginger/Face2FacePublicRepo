import logo from "./logo.svg";
import "./App.css";

import NewPropertyForm from "./Components/newProperty.js";
import ListProperties from "./Components/getProperties.js";
import NewUserForm from "./Components/newUser";
import UpdatePropertyImagesForm from "./Components/updateProperties";
import ListUsers from "./Components/getUsers.js";
import UpdateUser from "./Components/updateUser";

function App() {
	return (
		<div className="App">
			<NewPropertyForm />
			<br />
			<br />
			<br />
			<br />
			<br />
			<ListProperties />
			<br />
			<br />
			<br />
			<br />
			<h1>NewUserForm</h1>
			<NewUserForm />
			<br />
			<br />
			<br />
			<h1>Update Form</h1>
			<br />
			<UpdatePropertyImagesForm />

			<br />
			<br />
			<br />
			<br />
			<ListUsers />

			<br />
			<br />
			<br />
			<br />
			<UpdateUser />
		</div>
	);
}

export default App;
