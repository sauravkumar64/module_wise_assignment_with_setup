module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("adminNotification", {
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
			allowNull: true,
		},
		description: {
			type: DataTypes.STRING(500),
			allowNull: true,
		},
		isRead: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0,
		},
		url: {
			type: DataTypes.STRING(300),
			allowNull: true,
		}
	}, {
		tableName: "adminNotification"
	});
};
