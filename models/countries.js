module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("countries", {
		...require("./core")(Sequelize, DataTypes),
		countryIsoCode: {
			type: DataTypes.STRING(10),
			defaultValue: null,
		},
		name: {
			type: DataTypes.STRING(100),
			defaultValue: null,
		},
		images: {
			type: DataTypes.STRING(10),
			defaultValue: null,
		}
	}, {
		charset: "utf8mb4",
		collate: "utf8mb4_unicode_520_ci"
	}, { tableName: "countries" }
	);
};
