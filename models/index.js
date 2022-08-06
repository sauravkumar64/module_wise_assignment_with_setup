var Sequelize = require("sequelize");
var sequelize = require("../dbConnection").sequelize;
module.exports = {
	faqlist: require("./faqlist")(Sequelize, sequelize, Sequelize.DataTypes),
};