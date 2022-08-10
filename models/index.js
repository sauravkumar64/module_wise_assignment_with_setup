var Sequelize = require("sequelize");
var sequelize = require("../dbConnection").sequelize;
module.exports = {
  Admin: require("./admin")(Sequelize, sequelize, Sequelize.DataTypes),
	AdminPermissions: require("./adminPermissions")(Sequelize, sequelize, Sequelize.DataTypes),
  AdminSessions: require("./adminSessions")(Sequelize, sequelize, Sequelize.DataTypes),
}