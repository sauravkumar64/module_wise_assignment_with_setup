let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("reportedItem", {
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
		itemType: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.REPORT_ITEM_TYPES
		},
		itemId: {
			type: Sequelize.UUID,
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
		},
		description: {
			type: DataTypes.STRING(255),
			allowNull: true,
		}
	}, {
		tableName: "reportedItems"
	});
};