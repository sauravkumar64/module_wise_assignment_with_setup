let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("feedback", {
		...require("./core")(Sequelize, DataTypes),
		userId: {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "users", // name of Target model
				key: "id", // key in Target model that we"re referencing
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		type: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.FEEDBACK_TYPES
		},
		typeId: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		rating: {
			type: DataTypes.INTEGER,
			allowNull: false,
		}
	}, {
		tableName: "feedback"
	});
};
