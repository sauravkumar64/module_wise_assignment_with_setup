let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("reportedBug", {
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
		title: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		image: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.REPORT_STATUS
		},
		adminId: { // Admin changing status
			type: Sequelize.UUID,
			allowNull: true,
			references: {
				model: "admin",
				key: "id",
			}
		}
	}, {
		tableName: "reportedBugs"
	});
};