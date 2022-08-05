module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("notifications", {
		...require("./core")(Sequelize, DataTypes),
		senderId: {
			type: Sequelize.UUID,
			defaultValue: null
		},
		receiverId: {
			type: Sequelize.UUID,
			references: {
				model: "users", // name of Target model
				key: "id", // key in Target model that we're referencing
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE"
		},
		broadcastNotificationId: {
			type: Sequelize.UUID,
			references: {
				model: "broadcastNotifications", // name of Target model
				key: "id", // key in Target model that we're referencing
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
			defaultValue: null
		},
		platform: {
			type: DataTypes.TINYINT, // 1 for web, 2 for android, 3 for iOS
			allowNull: false,
			field: "platform",
			defaultValue: 1,
		},
		notificationType: {
			type: DataTypes.INTEGER,
			allowNull: false,
			field: "notificationType"
		},
		title: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: "title"
		},
		message: {
			type: DataTypes.TEXT(),
			allowNull: false,
			field: "message"
		},
		isRead: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0,
			field: "isRead"
		}
	}, { tableName: "notifications" });
};