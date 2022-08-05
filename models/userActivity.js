let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_activity", {
		...require("./core")(Sequelize, DataTypes),
		userId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "users"
			},
			type: Sequelize.UUID
		},
		type: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.USER_ACTIVITIES
		},
		typeId: {
			type: Sequelize.UUID,
			allowNull: true,
		}
	}, {
		tableName: "user_activities"
	});
};
