module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_notification_setting", {
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
		comment: {
			type: DataTypes.TINYINT(1),
			defaultValue: 1
		},
		post: {
			type: DataTypes.TINYINT(1),
			defaultValue: 1
		}
	}, {
		tableName: "user_notification_settings"
	});
};
