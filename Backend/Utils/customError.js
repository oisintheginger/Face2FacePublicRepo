class CustomError extends Error {
	constructor(
		message = "InternalServerError",
		statusMessage = "",
		errorCode,
		data = {}
	) {
		super(message);
		this.customMessage = message;
		this.errorCode = errorCode;
		this.statusMessage = statusMessage;
		this.data = data;
		this.success = false;
	}
}

exports.default = CustomError;
