module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("appVersion", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		version: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		minimumVersion: {
			type: DataTypes.STRING(255),
			allowNull: false,
		}
	}, {
		tableName: "appVersions"
	});
};
