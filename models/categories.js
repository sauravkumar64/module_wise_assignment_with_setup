module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("categories", {
		...require("./core")(Sequelize, DataTypes),
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		image: {
			type: DataTypes.STRING(255),
			allowNull: false,
		}
	}, {
		tableName: "categories"
	});
};
