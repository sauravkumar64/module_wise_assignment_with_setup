const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;


const admin = sequelize.define(
  "admintable",
  {
    adminId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    title:{
          type:DataTypes.STRING,
    },
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
 RegistrationPermission:{
  type:DataTypes.INTEGER,
  defaultValue:0, 
 },
 BlockedPermission:{
  type:DataTypes.INTEGER,
  defaultValue:0, 
 },
 UnblockedPermission:{
  type:DataTypes.INTEGER,
  defaultValue:0, 
 },
 DeletedPermission:{
  type:DataTypes.INTEGER,
  defaultValue:0, 
 },
  EditPermission:{
  type:DataTypes.INTEGER,
  defaultValue:0, 
 },
  },
  {
    freezeTableName: true,
    deletedAt: 'destroyTime', 
    paranoid: true
  }
);

module.exports = admin;
