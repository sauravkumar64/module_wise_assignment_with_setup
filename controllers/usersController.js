const _ = require("underscore");
const Joi = require("joi");
const Jwt = require("jsonwebtoken");
let commonHelper = require("../helpers/common");
let message = require("../config/messages");
let response = require("../config/response");
let Services = require("../services");
let TokenManager = require("../helpers/tokenManager");
let Upload = require("../helpers/upload");
const env = require("../config/env")();
const Mailer = require("../helpers/mailer");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
// const Constants = require("../config/constants");
var generateToken = async (userId, email, userType, platform) => {
	let tokenData = {
		email: email,
		id: userId,
		userType: userType,
		platform: platform
	};
	let projection = ["id", "firstName", "lastName", "gender", "profilePic", "age", "email", "countryCode", "phoneNumber", "registrationStep", "notificationEnabled", "address", "city", "isPhoneVerified", "isEmailVerified", "referralCode", "createdAt"];
	let userData = await Services.UserService.getUsers({
		id: userId
	}, projection);
	tokenData.email = userData.email;
	let token = await Jwt.sign(tokenData, env.APP_URLS.PRIVATE_KEY);
	let response = userData.dataValues;
	response.accessToken = token;
	response.s3Folders = env.AWS.S3.directories;
	return response;
};
var emailVerification = async (userId) => {
	try {
		let generatedString = await commonHelper.generateRandomNumbers(4);
		let criteria = {
			id: userId,
			isBlocked: 0,
			isDeleted: 0
		};
		let projection = ["id", "firstName", "lastName", "email", "isEmailVerified"];
		let userData = await Services.UserService.getUsers(criteria, projection);
		if (!userData) throw response.error_msg.InvalidID;
		let objToSave = {};
		objToSave.emailVerificationToken = generatedString;
		await Services.UserService.updateData(criteria, objToSave);
		let path = "/api/v1/user/verifyEmail?token=";
		var variableDetails = {
			name: userData.firstName + " " + userData.lastName,
			verificationUrl: env.APP_URLS.API_URL + path + generatedString,
			otp: generatedString,
			ip: env.APP_URLS.API_URL,
			// termsUrl: env.APP_URLS.API_URL + "/api/v1/user/terms",
			// privacyUrl: env.APP_URLS.API_URLL + "/api/v1/user/privacy-policy"
		};
		await Mailer.sendMail("REGISTER_USER", userData.email, variableDetails);
		return {};
	} catch (err) {
		console.log(err);
		throw err;
	}
};
var phoneNumberVerification = async (userId) => {
	try {
		// let generatedString = await commonHelper.generateRandomNumbers(4);
		let criteria = {
			id: userId,
			isBlocked: 0,
			isDeleted: 0
		};
		let projection = ["id", "firstName", "lastName", "email", "phoneNumber", "isEmailVerified"];
		let userData = await Services.UserService.getUsers(criteria, projection);
		if (!userData) throw response.error_msg.InvalidID;
		let objToSave = {};
		objToSave.otp = "1111"; //generatedString;
		await Services.UserService.updateData(criteria, objToSave);
		// Twilio.sendSms({ to: userData.phoneNumber, body: `Your verification code for common-library is : ${generatedString}` }, (err, smsData) => {
		// console.log(err, smsData);
		// });
		return {};
	} catch (err) {
		console.log(err);
		throw err;
	}
};
var verifyReferralCode = async (referralCode, userId) => {
	let criteria = {
		referralCode: referralCode,
		isBlocked: 0,
		isDeleted: 0
	};
	criteria.id = {
		[Op.ne]: userId
	};
	let getUserByReferralCode = await Services.UserService.getUsers(criteria, ["id", "referralUserCount"]);
	if (getUserByReferralCode) {
		await getUserByReferralCode.increment("referralUserCount", {
			by: 1
		});
		return getUserByReferralCode.id;
	} else {
		throw response.error_msg.invalidReferralCode;
	}
};
module.exports = {
	registerUser: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				platformType: Joi.string().valid("IOS", "ANDROID", "WEB").optional(),
				deviceToken: Joi.string().required(),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.string().optional().allow(""),
				email: Joi.string().email().optional().allow(""),
				password: Joi.string().optional(),
				userType: Joi.number().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let userData = null;
			let projection = ["id", "email", "isBlocked"];
			if (payload.email && payload.email != "") {
				let criteria = {
					"email": payload.email,
					"isDeleted": 0
				};
				userData = await Services.UserService.getUsers(criteria, projection);
				if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
				if (userData) throw response.error_msg.alreadyExist;
			}
			let criteria2 = {};
			let userDataPhone = null;
			if (payload.phoneNumber && payload.phoneNumber != "") {
				criteria2 = {
					"phoneNumber": payload.phoneNumber,
					"countryCode": payload.countryCode,
					"isDeleted": 0
				};
				userDataPhone = await Services.UserService.getUsers(criteria2, projection);
				if (userDataPhone && userDataPhone.isBlocked === 1) throw response.error_msg.blockUser;
				if (userDataPhone) throw response.error_msg.numberAlreadyExist;
			}
			if(payload.password && payload.password !== "") {
				payload.password = await commonHelper.encrypt(payload.password);
			}
			let setData = {};
			setData.referralCode = await commonHelper.generateRandomString(6, "alphanumeric", "uppercase");
			if (_.has(payloadData, "platformType") && payloadData.platformType != "") setData.platformType = payload.platformType;
			if (_.has(payloadData, "countryCode") && payloadData.countryCode != "") setData.countryCode = payload.countryCode;
			if (_.has(payloadData, "phoneNumber") && payloadData.phoneNumber != "") setData.phoneNumber = payload.phoneNumber;
			if (_.has(payloadData, "email") && payloadData.email != "") setData.email = payload.email;
			if (_.has(payloadData, "password") && payloadData.password != "") setData.password = payload.password;
			if (_.has(payloadData, "userType")) setData.userType = payload.userType;
			setData.notificationEnabled = 1;
			setData.registrationStep = 1;
			let createUser = await Services.UserService.saveData(setData);
			if (payload.email) {
				await emailVerification(createUser.id);
			}
			if (payload.phoneNumber) {
				await phoneNumberVerification(createUser.id);
			}
			if (createUser) {
				await Services.UserService.saveNotificationSettings({
					userId: createUser.id
				});
				//condition to store into userActivity
				await Services.UserActivityService.saveData({
					userId: createUser.id,
					type: "SIGN_UP"
				});
			}

			let sessionData = {
				id: createUser.id,
				deviceToken: payload.deviceToken,
				deviceType: payload.platformType
			};
			TokenManager.setToken(JSON.parse(JSON.stringify(sessionData)), (err) => {
				if (err) {
					throw response.error_msg.implementationError;
				}
			});
			let res = await generateToken(createUser.id, payload.email, "USER", payloadData.platformType);
			if(payload && payload.phoneNumber) {
				delete res.accessToken;
			}
			return res;
		} catch (err) {
			console.log("err", err);
			throw err;
		}
	},
	sendEmailForVerification: async (tokenData) => {
		return await emailVerification(tokenData.id);
	},
	sendMessageForVerification: async (tokenData) => {
		return await phoneNumberVerification(tokenData.id);
	},
	verifyEmail: async (request) => {
		console.log(request.otp, ":::::::::::");
		try {
			let criteria = {
				id: request.credentials.id,
				emailVerificationToken: request.query.otp || "",
			};
			let projection = ["id", "email", "otp", "emailVerificationToken"];
			let userData = await Services.UserService.getUsers(criteria, projection);
			if (!userData) throw response.error_msg.invalidOtp;
			if (userData.id) {
				let user = {
					"id": userData.id
				};
				await Services.UserService.updateData(user, {
					isEmailVerified: 1,
					emailVerificationToken: null
				});
			} else {
				throw response.error_msg.invalidOtp;
			}
			return {};
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	verifyPhoneNumber: async (request) => {
		try {
			let criteria = {
				"phoneNumber": request.body.phoneNumber,
				"otp": request.body.otp || "",
			};
			let projection = ["id", "phoneNumber", "otp", "platformType"];
			let userData = await Services.UserService.getUsers(criteria, projection);
			if (!userData) throw response.error_msg.invalidOtp;
			console.log(userData);
			if (userData.id) {
				let user = {
					"id": userData.id
				};
				await Services.UserService.updateData(user, {
					isPhoneVerified: 1,
					otp: null
				});
				return await generateToken(userData.id, "", "USER", userData.platformType);
			} else {
				throw response.error_msg.invalidOtp;
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	loginUser: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				platformType: Joi.string().valid("IOS", "ANDROID", "WEB").optional(),
				deviceToken: Joi.string().required(),
				emailOrPhoneNumber: Joi.string().required(),
				countryCode: Joi.string().optional().allow(""),
				password: Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				"isDeleted": 0
			};

			var errorMsg;
			if ((/\S+@\S+\.\S+/).test(payload.emailOrPhoneNumber)) {
				criteria.email = payload.emailOrPhoneNumber;
				errorMsg = response.error_msg.emailNotFound;
			} else {
				criteria.phoneNumber = payload.emailOrPhoneNumber;
				criteria.countryCode = payload.countryCode;
				errorMsg = response.error_msg.phoneNotFound;
			}

			let projection = ["id", "email", "password", "phoneNumber", "isBlocked"];
			let userData = await Services.UserService.getUsers(criteria, projection);
			//condition to store into userActivity
			let socialIdExists;
			if (userData) {
				await Services.UserActivityService.saveData({
					userId: userData.dataValues.id,
					type: "LOGIN"
				});
			}
			if (!userData) throw errorMsg;
			if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
			if (payload.password) {
				let password = await commonHelper.encrypt(payload.password);
				if (userData && userData.password != password) {
					throw response.error_msg.passwordNotMatch;
				}
			} else {
				socialIdExists = await Services.UserService.getUsersBySocialId({ userId: userData.id }, ["id"]);
				if (socialIdExists && userData.password === null) {
					throw response.error_msg.emailWithSocialLogin;
				} else {
					throw response.error_msg.passwordNotMatch;
				}
			}

			let sessionData = {
				id: userData.id,
				deviceToken: payload.deviceToken,
				deviceType: payload.platformType
			};
			TokenManager.setToken(JSON.parse(JSON.stringify(sessionData)), (err) => {
				if (err) {
					throw response.error_msg.implementationError;
				}
			});

			let res = await generateToken(userData.id, payload.emailOrPhoneNumber, "USER", payloadData.platformType);
			if(criteria.phoneNumber) {  // && !payload.password
				delete res.accessToken;
			}
			return res;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	socialLogin: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				social_id: Joi.string().optional().allow(""),
				loginType: Joi.number().optional().allow(""),
				deviceToken: Joi.string().required(),
				platformType: Joi.string().required(),
				emailOrPhoneNumber: Joi.string().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				password: Joi.string().optional().allow("")
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let projection = ["id", "email", "platformType", "isBlocked"];
			let criteria = {};
			let userExist = null;
			var errorMsg;
			if (_.has(payload, "social_id") && payload.social_id != "") {
				criteria.social_id = payload.social_id;
				criteria.loginType = payload.loginType;
				criteria.isDeleted = 0;
				userExist = await Services.UserService.getUsersBySocialId(criteria, ["id"]);
			}
			let userWithEmailExist = null;
			if (_.has(payload, "emailOrPhoneNumber") && payload.emailOrPhoneNumber != "") {
				let criteriaExist = {
					"isDeleted": 0,
				};
				if ((/\S+@\S+\.\S+/).test(payload.emailOrPhoneNumber)) {
					criteriaExist.email = payload.emailOrPhoneNumber;
					errorMsg = response.error_msg.emailNotFound;
				} else {
					criteriaExist.phoneNumber = payload.emailOrPhoneNumber;
					criteriaExist.countryCode = payload.countryCode;
					errorMsg = response.error_msg.phoneNotFound;
				}
				userWithEmailExist = await Services.UserService.getUsers(criteriaExist, projection);
			}
			if (userExist) {
				if (userExist.user && userExist.user.isBlocked === 1) throw response.error_msg.blockUser;
				let sessionData = {
					id: userExist.user.id,
					deviceToken: payload.deviceToken,
					deviceType: payload.platformType
				};
				TokenManager.setToken(JSON.parse(JSON.stringify(sessionData)), (err) => {
					if (err) {
						throw response.error_msg.implementationError;
					}
				});
				return await generateToken(userExist.user.id, userExist.user.email, "USER", userExist.user.platformType);
			}
			if (!userExist && userWithEmailExist) {
				if (userWithEmailExist && userWithEmailExist.isBlocked === 1) throw response.error_msg.blockUser;
				// let password = await commonHelper.encrypt(payload.password);
				// if (userWithEmailExist && userWithEmailExist.password != password) throw response.error_msg.passwordNotMatch;
				let dataToUpdate = {};
				let addSocialData = {};
				addSocialData.userId = userWithEmailExist.id;
				if (_.has(payload, "social_id") && payload.social_id != "") {
					addSocialData.social_id = payload.social_id;
					if (_.has(payload, "loginType")) addSocialData.loginType = payload.loginType;
					await Services.UserService.saveSocialData(addSocialData);
				}
				if (_.has(payload, "deviceToken") && payload.deviceToken != "") dataToUpdate.deviceToken = payload.deviceToken;
				if (_.has(payload, "platformType") && payload.platformType != "") dataToUpdate.platformType = payload.platformType;
				await Services.UserService.updateData({
					id: userWithEmailExist.id
				}, dataToUpdate);
				let sessionData = {
					id: userWithEmailExist.id,
					deviceToken: payload.deviceToken,
					deviceType: payload.platformType
				};
				TokenManager.setToken(JSON.parse(JSON.stringify(sessionData)), (err) => {
					if (err) {
						throw response.error_msg.implementationError;
					}
				});
				return await generateToken(userWithEmailExist.id, userWithEmailExist.email, "USER", payload.platformType);
			}
			if (!userWithEmailExist && !payload.social_id) {
				if (!userWithEmailExist) throw errorMsg;
			}
			if (!userExist && !userWithEmailExist) {
				let setData = {};
				if ((/\S+@\S+\.\S+/).test(payload.emailOrPhoneNumber)) {
					setData.email = payload.emailOrPhoneNumber;
					setData.isEmailVerified = 1;
				} else if ((/\d/).test(payload.emailOrPhoneNumber)) {
					setData.phoneNumber = payload.emailOrPhoneNumber;
					setData.countryCode = payload.countryCode;
				} else {
					setData.isEmailVerified = 1;
				}
				if (_.has(payload, "password") && payload.password != "") setData.password = payload.password;
				if (_.has(payload, "platformType") && payload.platformType != "") setData.platformType = payload.platformType;
				setData.registrationStep = 1;
				let createUser = await Services.UserService.saveData(setData);
				if (_.has(payload, "social_id") && payload.social_id != "") {
					let addSocialData = {};
					addSocialData.social_id = payload.social_id;
					addSocialData.userId = createUser.id;
					if (_.has(payload, "loginType")) addSocialData.loginType = payload.loginType;
					await Services.UserService.saveSocialData(addSocialData);
				}
				let sessionData = {
					id: createUser.id,
					deviceToken: payload.deviceToken,
					deviceType: payload.platformType
				};
				TokenManager.setToken(JSON.parse(JSON.stringify(sessionData)), (err) => {
					if (err) {
						throw response.error_msg.implementationError;
					}
				});
				return await generateToken(createUser.id, payload.emailOrPhoneNumber, "USER", payloadData.platformType);
			}
		} catch (e) {
			console.log(e);
			throw e;
		}
	},
	createProfile: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				id: Joi.string().optional(),
				platformType: Joi.string().valid("IOS", "ANDROID", "WEB").optional(),
				referralCode: Joi.string().optional().allow(""),
				firstName: Joi.string().optional(),
				lastName: Joi.string().optional(),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.string().optional().allow(""),
				email: Joi.string().email().optional().allow(""),
				city: Joi.string().optional(),
				address: Joi.string().optional(),
				gender: Joi.string().valid("Male", "Female", "Other", "NA").optional(),
				profilePic: Joi.string().optional(),
				age: Joi.number().optional(),
				registrationStep: Joi.number().optional(),
				signupType: Joi.string().valid("EMAIL_OR_PHONE", "FACEBOOK", "GMAIL", "APPLE", "MICROSOFT").optional(),
				notificationEnabled: Joi.string().valid("0", "1").optional(),
				isBlocked: Joi.string().valid(0, 1).optional(),
				isDeleted: Joi.string().valid(0, 1).optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				"id": payload.id,
			};
			let projection = ["id", "firstName", "lastName", "gender", "profilePic", "age", "email", "countryCode", "phoneNumber", "registrationStep", "notificationEnabled", "address", "city", "isPhoneVerified", "isEmailVerified", "referralCode", "isBlocked", "createdAt"];
			let userData = await Services.UserService.getUsers(criteria, projection);
			if (!userData) throw response.error_msg.userNotFound;
			let setData = {};
			if (_.has(payload, "referralCode") && payload.referralCode != "") {
				payload.referredBy = await verifyReferralCode(payload.referralCode, payload.id);
			}
			if (_.has(payload, "platformType")) setData.platformType = payload.platformType;
			if (_.has(payload, "signupType")) setData.signupType = payload.signupType;
			if (_.has(payload, "firstName")) setData.firstName = payload.firstName;
			if (_.has(payload, "lastName")) setData.lastName = payload.lastName;
			if (_.has(payload, "gender")) setData.gender = payload.gender;
			if (_.has(payload, "countryCode") && payload.countryCode != "") setData.countryCode = payload.countryCode;
			if (_.has(payload, "phoneNumber") && payload.phoneNumber != "") {
				setData.phoneNumber = payload.phoneNumber;
			}
			if (_.has(payload, "email") && payload.email != "") {
				setData.email = payload.email;
			}
			if (_.has(payload, "profilePic")) setData.profilePic = payload.profilePic;
			if (_.has(payload, "age")) setData.age = payload.age;
			if (_.has(payload, "notificationEnabled")) setData.notificationEnabled = payload.notificationEnabled;
			if (_.has(payload, "isBlocked")) setData.isBlocked = payload.isBlocked;
			if (_.has(payload, "isDeleted")) setData.isDeleted = payload.isDeleted;
			if (_.has(payload, "city") && payload.city != "") setData.city = payload.city;
			if (_.has(payload, "address") && payload.address != "") setData.address = payload.address;
			if (_.has(payload, "referredBy")) setData.referredBy = payload.referredBy;
			setData.registrationStep = 2;
			await Services.UserService.updateData(criteria, setData);
			let userDataUpdated = await Services.UserService.getUsers(criteria, projection);
			let data = userDataUpdated.dataValues;
			data.s3Folders = env.AWS.S3.directories;
			return data;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	forgotPassword: async (payloadData) => {
		try {
			let token = await commonHelper.generateRandomNumbers(6);
			const schema = Joi.object().keys({
				email: Joi.string().email().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.string().optional().allow(""),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			if ((!payload.email) && (!payload.phoneNumber)) throw response.error_msg.emailOrPhoneNumberRequired;
			let criteria = {
				"isDeleted": 0
			};
			if (payload.email) {
				criteria.email = payload.email;
			} else {
				criteria.countryCode = payload.countryCode;
				criteria.phoneNumber = payload.phoneNumber;
			}
			let userData = await Services.UserService.getUsers(criteria, ["id", "firstName", "lastName", "email", "countryCode", "phoneNumber", "isBlocked"]);
			if (!userData) throw response.error_msg.userNotFound;
			if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
			let otp = "1111"; //await commonHelper.generateRandomNumbers(4);
			let newToken = await commonHelper.encrypt(token);
			criteria = {
				"id": userData.id
			};
			if (payload.email) {
				let path = "/api/v1/user/generatePassword?email=" + payload.email + "&token=";
				var variableDetails = {
					name: userData.firstName + " " + userData.lastName,
					otp: otp,
					ip: env.APP_URLS.API_URL,
					resetPasswordToken: env.APP_URLS.API_URL + path + token,
					// termsUrl: env.APP_URLS.API_URL + "/api/v1/user/terms",
					// privacyUrl: env.APP_URLS.API_URL + "/api/v1/user/privacy-policy"
				};
				await Mailer.sendMail("FORGOT_PASSWORD", payload.email, variableDetails);
			} else {
				otp = "1111";
				// Twilio.sendSms({ to: userData.phoneNumber, body: `Your verification code for common-library is : ${otp}` }, (err, smsData) => {
				// console.log(err, smsData);
				// });
			}
			await Services.UserService.updateData(criteria, { forgotPasswordOtp: otp, forgotPasswordToken: newToken });
			return { token: token };
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	verifyForgetPasswordOtp: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				token: Joi.string().required(),
				forgotPasswordOtp: Joi.number().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let encryptedToken = await commonHelper.encrypt(payload.token);
			let criteria = {
				"forgotPasswordToken": encryptedToken,
				"isDeleted": 0
			};
			let projection = ["id", "email", "forgotPasswordOtp", "isBlocked"];
			let userData = await Services.UserService.getUsers(criteria, projection, false);
			if (!userData) throw response.error_msg.InvalidPasswordToken;
			if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
			if (userData.forgotPasswordOtp == payload.forgotPasswordOtp) {
				let user = {
					"id": userData.id
				};
				await Services.UserService.updateData(user, {
					forgotPasswordOtp: null
				});
			} else {
				throw response.error_msg.invalidOtp;
			}
			return { token: payload.token };
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	resetPassword: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				password: Joi.string().required(),
				token: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let encryptedToken = await commonHelper.encrypt(payload.token);
			let userData = await Services.UserService.getUsers({ "isDeleted": 0, "forgotPasswordToken": encryptedToken }, ["id", "email"]);
			if (!userData) throw response.error_msg.InvalidPasswordToken;
			let criteria = {
				"id": userData.id
			};
			let password = await commonHelper.encrypt(payload.password);
			await Services.UserService.updateData(criteria, {
				password: password,
				forgotPasswordToken: null
			});
			return {};
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	resetPasswordEmail: async (payloadData) => {
		const schema = Joi.object().keys({
			email: Joi.string().optional(),
			token: Joi.string().optional().required(),
			newPassword: Joi.string().min(5).required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let userData = await Services.UserService.getUsers({
			"isDeleted": 0,
			"forgotPasswordToken": payload.token
		}, ["id", "email"]);
		if (userData) {
			if (userData && userData.id) {
				let criteria = {
					id: userData.id
				};
				let objToSave = {
					password: await commonHelper.encrypt(payload.newPassword),
					forgotPasswordToken: null
				};
				let update = await Services.UserService.updateData(criteria, objToSave);
				if (update) {
					return {};
				} else throw response.error_msg.implementationError;
			} else {
				throw response.error_msg.implementationError;
			}
		} else {
			throw response.error_msg.InvalidPasswordToken;
		}
	},
	changePassword: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				password: Joi.string().min(5).required(),
				oldPassword: Joi.string().min(5).required(),
				id: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			if (!payload || !payload.password) {
				throw response.error_msg.implementationError;
			} else {
				let criteria = {
					isDeleted: 0
				};
				if (_.has(payload, "id")) criteria.id = payload.id;
				let projection = ["id", "email", "password", "phoneNumber", "isBlocked"];
				let userData = await Services.UserService.getUsers(criteria, projection);
				if (!userData) throw response.error_msg.emailAndPasswordNotFound;
				if (userData && userData.isBlocked === 1) throw response.error_msg.blockUser;
				let oldPassword = await commonHelper.encrypt(payload.oldPassword);
				if (userData && userData.password !== oldPassword) throw response.error_msg.passwordNotMatch;
				let password = await commonHelper.encrypt(payload.password);
				let objToSave = {
					password: password
				};
				let update = await Services.UserService.updateData(criteria, objToSave);
				if (update) {
					return {};
				} else throw response.error_msg.implementationError;
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	logout: async (payloadData, token) => {
		try {
			const schema = Joi.object().keys({
				deviceToken: Joi.string().required(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			//condition to store into userActivity
			if (payload) {
				await Services.UserActivityService.saveData({
					userId: token.id,
					type: "LOGOUT"
				});
			}
			await TokenManager.expireToken(token, payload.deviceToken, (err, output) => {
				if (err) {
					throw response.error_msg.implementationError;
				} else {
					return output;
				}
			});
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	uploadUrl: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				folder: Joi.string().required(),
				fileName: Joi.string().required()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			return Upload.getS3SignedURL(payload);
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	getUserDetail: async (tokenData) => {
		try {
			let criteria = {
				id: tokenData.id
			};
			let projection = ["id", "firstName", "lastName", "gender", "profilePic", "age", "email", "countryCode", "phoneNumber", "registrationStep", "notificationEnabled", "address", "city", "isPhoneVerified", "isEmailVerified", "referralCode", "createdAt"];
			let result = await Services.UserService.getUsers(criteria, projection);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	referredUserList: async (queryData) => {
		try {
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
				id:Joi.string().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(queryData, schema);
			let criteria = {
				referredBy: payload.id,
			};
			let result = await Services.UserService.getUsersList(criteria, ["id", "firstName", "lastName", "profilePic"], payload.limit || env.DEFAULTS.PAGE_LIMIT, payload.skip || 0);
			return result;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	updateUser: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				email: Joi.string().email().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.number().optional().allow(""),
				firstName: Joi.string().optional(),
				lastName: Joi.string().optional(),
				city: Joi.string().optional(),
				address: Joi.string().optional(),
				gender: Joi.string().valid("Male", "Female", "Other", "NA").optional(),
				profilePic: Joi.string().optional(),
				age: Joi.number().optional(),
				notificationEnabled: Joi.string().valid("0", "1").optional(),
				id:Joi.string().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let criteria = {
				id: payload.id
			};
			let objToSave = {};
			if (_.has(payload, "email") && payload.email != "") objToSave.email = payload.email;
			if (_.has(payload, "phoneNumber") && payload.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
			if (_.has(payload, "countryCode") && payload.countryCode != "") objToSave.countryCode = payload.countryCode;
			if (_.has(payload, "firstName")) objToSave.firstName = payload.firstName;
			if (_.has(payload, "lastName")) objToSave.lastName = payload.lastName;
			if (_.has(payload, "gender")) objToSave.gender = payload.gender;
			if (_.has(payload, "profilePic")) objToSave.profilePic = payload.profilePic;
			if (_.has(payload, "age")) objToSave.age = payload.age;
			if (_.has(payload, "notificationEnabled")) objToSave.notificationEnabled = payload.notificationEnabled;
			if (_.has(payload, "city") && payload.city != "") objToSave.city = payload.city;
			if (_.has(payload, "address") && payload.address != "") objToSave.address = payload.address;
			let isUpdated = await Services.UserService.updateData(criteria, objToSave);
			if (isUpdated) {
				let projection = ["id", "firstName", "lastName", "gender", "profilePic", "age", "email", "countryCode", "phoneNumber", "registrationStep", "notificationEnabled", "address", "city", "isPhoneVerified", "isEmailVerified", "referralCode", "createdAt"];
				let userData = await Services.UserService.getUsers(criteria, projection);
				let data = userData.dataValues;
				data.s3Folders = env.AWS.S3.directories;
				return data;
			} else {
				throw response.error_msg.implementationError;
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	deleteUser: async (tokenData) => {
		try {
			let session = await Services.SessionsService.getSessionDetail({
				userId: tokenData.id
			}, ["id", "deviceToken"]);
			await Services.UserService.updateData({
				id: tokenData.id
			}, {
				isDeleted: 1
			});
			await Services.UserService.updateSocialAccounts({
				userId: tokenData.id
			}, {
				isDeleted: 1
			});
			if (session) {
				await TokenManager.expireToken(tokenData, session.deviceToken, (err, output) => {
					if (err) {
						throw response.error_msg.implementationError;
					} else {
						return output;
					}
				});
			} else {
				return {};
			}
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	updateUserNotifications: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				comment: Joi.number().optional(),
				post: Joi.number().optional(),
				id:Joi.string().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			if (_.has(payload, "comment")) objToSave.comment = payload.comment;
			if (_.has(payload, "post")) objToSave.post = payload.post;
			await Services.UserService.updateNotificationSettings({
				userId: payload.id
			}, objToSave);
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	validateToken: async (payloadData) => {
		const schema = Joi.object().keys({
			token: Joi.string().required(),
			email: Joi.string().email().required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		if (!payload || !payload.token) {
			throw response.error_msg.implementationError;
		} else {
			let criteria = {
				email: payload.email || "",
				isDeleted: 0
			};
			criteria.forgotPasswordToken = payload.token;
			let data = await Services.UserService.getUsers(criteria, ["id", "email", "firstName"]);
			if (!data) throw response.error_msg.emailNotFound;
			return data;
		}
	},
	getCountriesList: async (queryData) => {
		try {
			const schema = Joi.object().keys({
				limit: Joi.number().optional(),
				skip: Joi.number().optional(),
			});
			let payload = await commonHelper.verifyJoiSchema(queryData, schema);
			let projection = ["id", "countryIsoCode", "name"];
			let countries = await Services.UserService.listCountries(payload, projection, payload.limit || env.DEFAULTS.PAGE_LIMIT, payload.skip || 0);
			return countries;
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	contactUs: async (payloadData) => {
		try {
			const schema = Joi.object().keys({
				userId: Joi.string().required(),
				email: Joi.string().email().optional().allow(""),
				countryCode: Joi.string().optional().allow(""),
				phoneNumber: Joi.string().optional().allow(""),
				firstName: Joi.string().optional(),
				lastName: Joi.string().optional(),
				contactType: Joi.string().optional(),
				title: Joi.string().optional(),
				comment: Joi.string().optional()
			});
			let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
			let objToSave = {};
			objToSave.userId = payload.userId;
			if (_.has(payload, "email") && payload.email != "") objToSave.email = payload.email;
			if (_.has(payload, "countryCode") && payload.countryCode != "") objToSave.countryCode = payload.countryCode;
			if (_.has(payload, "phoneNumber") && payload.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
			if (_.has(payload, "firstName")) objToSave.firstName = payload.firstName;
			if (_.has(payload, "lastName")) objToSave.lastName = payload.lastName;
			if (_.has(payload, "contactType")) objToSave.contactType = payload.contactType;
			if (_.has(payload, "title")) objToSave.title = payload.title;
			if (_.has(payload, "comment")) objToSave.comment = payload.comment;
			await Services.UserService.createContactUs(objToSave);
			return {};
		} catch (err) {
			console.log(err);
			throw err;
		}
	},
	addUserActivity: async (payloadData) => {
		const schema = Joi.object().keys({
			type: Joi.string().required(),
			//typeId: Joi.string().required(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		console.log(payload, "????????????");
		let objToSave = {};
		if (_.has(payloadData, "type") && payloadData.type != "") objToSave.type = payload.type;
		objToSave.userId = "abc";
		objToSave.typeId = "avc";
		let create = await Services.UserActivityService.saveData(objToSave);
		if (create) {
			return message.success.ADDED;
		}
	},
};