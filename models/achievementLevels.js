module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("achievementLevel", {
		...require("./core")(Sequelize, DataTypes),
		achievementId: {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "achievements",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		name: {
			type: DataTypes.STRING(150),
			allowNull: true
		}
	}, {
		tableName: "achievementLevels"
	});
};