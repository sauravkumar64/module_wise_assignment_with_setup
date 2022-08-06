var _ = require("underscore");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
var randomString = require("randomstring");
const bcrypt = require("bcryptjs");
// const encrypt = require("encrypt");
const SaltSounds = 10;
// const emailValidator = (email) => {
// 	return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
// };
//const Joi = require("joi");
module.exports = {
	randomIntegerOtp: function() {
		return Math.floor(1000 + Math.random() * 9000);
	},
	// generateHashPassword: async (password) => {
	// 	const hash = await encrypt(password);
	// 	return hash;
	// },
	generateRandomString: (size, type, capitalization) => {
		if (capitalization) {
			return randomString.generate({ length: size, charSet: type, capitalization: capitalization });
		} else {
			return randomString.generate({ length: size, charSet: type });
		}
	},
	// escapeRegExp(text) {
	// 	return text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
	// },
	verifyJoiSchema: async(data, schema) => {
		const validSchema = await schema.validate(data);
		if ((validSchema) && (validSchema.error)) {
			throw validSchema.error;
		} else {
			return validSchema.value;
		}
	},
	generateRandomNumbers: async(numberLength, excludeList) => {
		var arrayList = [];
		excludeList = excludeList || [];
		var minString = "0";
		var maxString = "9";
		for (var i = 1; i < numberLength; i++) {
			minString = minString + "0";
			maxString = maxString + "9";
		}
		var minNumber = parseInt(minString, 10);
		var maxNumber = parseInt(maxString, 10);
		for (i = minNumber; i < maxNumber; i++) {
			var digitToCheck = i.toString();
			if (digitToCheck.length < numberLength) {
				var diff = numberLength - digitToCheck.length;
				var zeros = "";
				for (var j = 0; j < diff; j++) {
					zeros += "0";
				}
				digitToCheck = zeros + digitToCheck;
			}
			if (digitToCheck < 1000)
				if (excludeList.indexOf(digitToCheck) == -1) {
					arrayList.push(digitToCheck);
				}
		}
		if (arrayList.length > 0) {
			arrayList = _.shuffle(arrayList);
			return arrayList[0];
		} else {
			return false;
		}
	},
	generateNewPassword: async(text) => {
		var hash = await bcrypt.hashSync(text, SaltSounds);
		return hash;
	},
	comparePassword: async(text, hash) => {
		var hashCode = await bcrypt.compare(text, hash);
		return hashCode;
	},
	decrypt: async(secretKey) => {
		const decipher = crypto.createDecipher(algorithm, secretKey);
		let dec = decipher.update(secretKey, "hex", "utf8 ");
		dec += decipher.final("utf8");
		return dec;
	},
	encrypt: async(secretKey) => {
		const cipher = crypto.createCipher(algorithm, secretKey);
		let encrypted = cipher.update(secretKey, "utf8", "hex");
		encrypted += cipher.final("hex");
		return encrypted;
	}
};