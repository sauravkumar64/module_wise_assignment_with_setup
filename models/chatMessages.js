module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("chatMessage", {
		...require("./core")(Sequelize, DataTypes),
		chatDetailId: {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "chatDetails", // name of Target model
				key: "id", // key in Target model that we"re referencing
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		isReply: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0,
		},
		parentId: {
			type: Sequelize.UUID,
			allowNull: true,
			references: {
				model: "chatMessages", // name of Target model
				key: "id", // key in Target model that we"re referencing
			},
		},
		userId: {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "users", // name of Target model
				key: "id", // key in Target model that we"re referencing
			}
		},
		message: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		fileUrl: {
			type: DataTypes.STRING(1024),
			allowNull: true,
		},
		isDeleted: {
			type: DataTypes.TINYINT(1),
			defaultValue: 0,
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW(0)
		}
	}, {
		tableName: "chatMessages"
	});
};
