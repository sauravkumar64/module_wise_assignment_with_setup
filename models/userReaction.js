let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("user_reaction", {
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
		type: {
			type: DataTypes.ENUM,
			values: appConstants.APP_CONSTANTS.REACTION_TYPES
		},
		typeId: {
			type: Sequelize.UUID,
			allowNull: false,
		},
		reaction: {
			type: DataTypes.INTEGER,
			defaultValue: null,
		}
	}, {
		tableName: "user_reaction"
	});
};
