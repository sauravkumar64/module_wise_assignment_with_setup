let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("achievementRules", {
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
		achievementLevelId: {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				model: "achievementLevels",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		},
		name: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		event: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.ACHIEVEMENT_EVENTS
		},
		eventType: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.ACHIEVEMENT_EVENT_TYPES
		}
	}, {
		tableName: "achievementRules"
	});
};