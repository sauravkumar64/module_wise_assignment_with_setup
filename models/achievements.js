let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("achievement", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(150),
			allowNull: true
		},
		type: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.ACHIEVEMENT_TYPES
		}
	}, {
		tableName: "achievements"
	});
};