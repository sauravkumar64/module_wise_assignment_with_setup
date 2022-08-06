const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../connectionDB").sequelize;


const user = sequelize.define(
  "usertable",
  {
    adminId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    // title:{
    //       type:DataTypes.STRING,
    // },
    IsAdmin:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Isblocked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    freezeTableName: true,
    deletedAt: 'destroyTime', 
    paranoid: true
  }
);

module.exports = user;
