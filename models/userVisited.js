let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_visited", {
		id: {
			type: Sequelize.UUID,
			defaultValue: Sequelize.UUIDV4,
			primaryKey: true,
		},
		userId: {
			onDelete: "CASCADE",
			onUpdate: "CASCADE",
			references: {
				key: "id",
				model: "users"
			},
			type: Sequelize.UUID
		},
		url: {
			type: DataTypes.STRING(1024),
			allowNull: true,
		},
		type: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.USER_ACTIVITIES
		},
		typeId: {
			type: Sequelize.UUID,
			allowNull: true,
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW(0)
		}
	}, {
		tableName: "user_visited"
	});
};
