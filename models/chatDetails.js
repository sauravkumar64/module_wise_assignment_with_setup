let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("chatDetail", {
		...require("./core")(Sequelize, DataTypes),
		type: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.CHAT_TYPES
		},
		typeId: {
			type: Sequelize.UUID,
			allowNull: false,
		}
	}, {
		tableName: "chatDetails"
	});
};
