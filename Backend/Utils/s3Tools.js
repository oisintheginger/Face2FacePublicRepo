const {
	S3Client,
	PutObjectCommand,
	GetObjectCommand,
	DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const sharp = require("sharp");
const crypto = require("crypto");
const bucketName = process.env.S3_BUCKET;
const bucketRegion = process.env.S3_REGION;
const bucketAccessKey = process.env.S3_ACCESS_KEY;
const secretKey = process.env.S3_SECRET_KEY;
/**
 * The S3 uploading/deleting and url generation is adapted from Sam Meech Wards tutorial
 * https://www.youtube.com/watch?v=eQAIojcArRY
 */
const s3Object = new S3Client({
	credentials: {
		accessKeyId: bucketAccessKey,
		secretAccessKey: secretKey,
	},
	region: bucketRegion,
});

s3Upload = async (file, imageName) => {
	const resizedImageBuffer = await sharp(file.buffer)
		.resize({ height: 512, width: 512, fit: "contain" })
		.toBuffer();

	const params = {
		Bucket: bucketName,
		Key: imageName,
		Body: resizedImageBuffer,
		ContentType: file.mimetype,
	};
	const putCommand = new PutObjectCommand(params);
	await s3Object.send(putCommand);
};

exports.s3Get = async (imageName, expiresIn = 60) => {
	if (imageName == "" || imageName == null) {
		return "";
	}
	const getCommand = new GetObjectCommand({
		Bucket: bucketName,
		Key: imageName,
	});
	return await getSignedUrl(s3Object, getCommand, { expiresIn: expiresIn });
};

exports.s3Delete = async (imageName) => {
	const DeleteCommand = new DeleteObjectCommand({
		Bucket: bucketName,
		Key: imageName,
	});
	await s3Object.send(DeleteCommand);
};
nameRandomizer = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

exports.FileUpload = async function (fileToUpload, imageName = null) {
	try {
		if (imageName == null || imageName == "") {
			imageName = nameRandomizer();
		}
		await s3Upload(fileToUpload, imageName);
		return imageName;
	} catch (error) {
		throw error;
	}
};
