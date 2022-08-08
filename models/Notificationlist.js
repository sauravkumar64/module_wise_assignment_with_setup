var sequelize = require("../dbConnection").sequelize;
var Sequelize = require("sequelize");


const Notificationlist = sequelize.define(
  "Notificationlist",
  {
    
    
    notificationId: {
      type: Sequelize.DataTypes.UUID,
      defaultValue: Sequelize.DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.DataTypes.UUID,
      references: {
        model: "admin_table",
        key: "id",
      },
    },
    platform: {
      type: Sequelize.DataTypes.STRING,
    },
    notification: {
      type: Sequelize.DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
    deletedAt: 'destroyTime', 
  }
);

module.exports = Notificationlist;