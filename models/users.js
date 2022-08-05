let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("users", {
		...require("./core")(Sequelize, DataTypes),
		firstName: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		lastName: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		email: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		password: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		countryCode: {
			type: DataTypes.STRING(5),
			defaultValue: null,
		},
		phoneNumber: {
			type: DataTypes.STRING(16),
			defaultValue: null,
		},
		isPhoneVerified: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		otp: {
			type: DataTypes.STRING(6),
			defaultValue: null,
		},
		isEmailVerified: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		registrationStep: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		emailVerificationToken: {
			type: DataTypes.STRING(10),
			defaultValue: null,
		},
		forgotPasswordOtp: {
			type: DataTypes.STRING(10),
			defaultValue: null,
		},
		forgotPasswordToken: {
			type: DataTypes.STRING(150),
			defaultValue: null,
		},
		profilePic: {
			type: DataTypes.STRING(200),
			defaultValue: null,
		},
		gender: {
			type: DataTypes.ENUM,
			values: ["Male", "Female", "Other", "NA"],
			defaultValue: "NA"
		},
		age: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		},
		platformType: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.SUPPORTED_PLATFORMS
		},
		signupType: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.USER_SIGNUP_TYPES
		},
		notificationEnabled: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		userTerms: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0
		},
		referralCode: {
			type: DataTypes.STRING(200),
			defaultValue: null,
		},
		referredBy: {        // id of user     
			type: Sequelize.UUID,
			defaultValue: null,
		},
		referralUserCount: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		address: {
			type: DataTypes.STRING(300),
			defaultValue: null,
		},
		city: {
			type: DataTypes.STRING(255),
			defaultValue: null,
		},
		userType: {
			type: DataTypes.TINYINT(1),
			defaultValue: 1
		},
		averageFeedback: {
			type: DataTypes.FLOAT(3),
			defaultValue: null
		}
	}, { tableName: "users" }
	);
};
