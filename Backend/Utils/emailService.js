const nodemailer = require("nodemailer");

const emailAccount = process.env.EMAILACCOUNT;
const accountPass = process.env.EMAILPASSWORD;

const transporter = nodemailer.createTransport({
	service: "outlook",
	auth: {
		user: emailAccount,
		pass: accountPass,
	},
});

exports.SendEmail = function ({ target, subject, payload, html = "" }) {
	const mailOptions = {
		from: emailAccount,
		to: target,
		subject: subject,
		text: payload,
		html: html,
	};
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log("Email sent: " + info.response);
		}
	});
};
