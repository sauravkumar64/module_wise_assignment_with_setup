let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("contactUs", {
		...require("./core")(Sequelize, DataTypes),
		userId: {
			type: Sequelize.UUID,
			allowNull: true,
			references: {
				model: "users", // name of Target model
				key: "id", // key in Target model that we"re referencing
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
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
		countryCode: {
			type: DataTypes.STRING(5),
			defaultValue: null,
		},
		phoneNumber: {
			type: DataTypes.STRING(16),
			defaultValue: null,
		},
		contactType: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.FEEDBACK_TYPES
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: true,
		}
	}, {
		tableName: "contactUs"
	});
};
