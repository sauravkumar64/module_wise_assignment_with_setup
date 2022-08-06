var Sequelize = require("sequelize");
var sequelize = require("../dbConnection").sequelize;
module.exports = {
  version: require("./version")(Sequelize, sequelize, Sequelize.DataTypes),
};
