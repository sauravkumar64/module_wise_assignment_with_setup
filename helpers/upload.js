"use strict";
const AWS = require("aws-sdk");
const env = require("../config/env")();
AWS.config.update({
	accessKeyId: env.AWS.accessKeyId,
	secretAccessKey: env.AWS.secretAccessKey,
	region: env.AWS.awsRegion
});
const s3 = new AWS.S3();
const S3Bucket = env.AWS.S3.bucket;
// Change this value to adjust the signed URL's expiration
const URL_EXPIRATION_SECONDS = 900;
exports.getS3SignedURL = async function(payload) {
	const randomID = parseInt(Math.random() * 10000, 10);
	let fileExtension = payload.fileName.split(".")[payload.fileName.split(".").length - 1];
	const Key = `${payload.folder}${randomID}.${fileExtension}`;
	let contentType = "image/jpeg";
	if (fileExtension == "mp4") contentType = "video/mp4";
	if (fileExtension == "png") contentType = "image/png";
	// Get signed URL from S3
	const s3Params = {
		Bucket: S3Bucket,
		Key,
		Expires: URL_EXPIRATION_SECONDS,
		ContentType: contentType,
		ACL: "public-read"
	};
	try {
		const uploadURL = await s3.getSignedUrlPromise("putObject", s3Params);
		return {
			uploadURL: uploadURL,
			fileName: `${randomID}.${fileExtension}`,
			thumbnail: `${randomID}.jpg`,
			Key
		};
	} catch (err) {
		console.log(err);
		throw err;
	}
};

exports.s3Upload = async(body) => {
	const params = {
		Key: body.fileName,
		Body: body.stream,
		Bucket: S3Bucket,
		ContentType: body.contentType,
		ACL: "public-read"
	};

	await s3.upload(params, (err, res) => {
		if (err) {
			console.log(err, "err");
			throw err;
		}
		// console.log(res, "res");
		return res;
	});
};