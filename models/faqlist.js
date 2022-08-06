//let appConstants = require("../config/appConstants");
module.exports = function (Sequelize, sequelize, DataTypes) {
	return sequelize.define("faqlist", {
		...require("./core")(Sequelize, DataTypes),
		username: {
			type: Sequelize.DataTypes.STRING,
			defaultValue: null,
		},
		faq:{
			type: Sequelize.DataTypes.STRING,
			defaultValue: null
		},
		status:{
			type:Sequelize.DataTypes.ENUM("solved","unsolved"),
			defaultValue:"unsolved"
		}	}, {
		tableName: "faqlist",
		timestamps: true,
		paranoid: true,
	});
};