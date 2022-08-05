let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("que_tasks", {
		...require("./core")(Sequelize, DataTypes),
		methodName: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		type: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		status: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.TYPE_STATUS
		}
	}, {
		tableName: "que_tasks"
	});
};