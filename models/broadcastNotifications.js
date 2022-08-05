module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("broadcastNotifications", {
		...require("./core")(Sequelize, DataTypes),
		adminId: {
			type: Sequelize.UUID,
			allowNull: true,
			references: {
				model: "admin", // name of Target model
				key: "id", // key in Target model that we"re referencing
			}
		},
		title: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		image: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		platformType: {
			type: DataTypes.ENUM,
			values: ["ANDROID", "IOS", "WEB"],
			defaultValue: null
		}
	}, {
		tableName: "broadcastNotifications"
	});
};