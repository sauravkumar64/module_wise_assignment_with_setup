var sequelize = require("../dbConnection").sequelize;
var Sequelize = require("sequelize");

let appVersion = sequelize.define(
  "appVersion",
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true 
      
    },
    appname: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: null,
    },
    version: {
      type: Sequelize.DataTypes.FLOAT,
      defaultValue: null,
     
    },
    platform: {
      type: Sequelize.DataTypes.ENUM('Android', 'IOS'),
      defaultValue: null,
    },
    isdeleted:{
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
    },
    minimumVersion: {
      type: Sequelize.DataTypes.FLOAT,
      defaultValue: null,
    },
    latestVersion: {
      type: Sequelize.DataTypes.FLOAT,
      defaultValue: null,
    }
  },
  {
    tableName: "appVersion",
    timestamps: true,
    paranoid: true,
    deletedAt: 'destroyTime'
  }
);

module.exports = appVersion;
