var sequelize = require("../dbConnection").sequelize;
var Sequelize = require("sequelize");


let Admin = sequelize.define(
  "admin_table",
  {
   id: {
      defaultValue: Sequelize.DataTypes.UUIDV4,
      type: Sequelize.UUID,
      primaryKey: true,
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      defaultValue: null,
    },
    email: {
      type: Sequelize.DataTypes.STRING,
      unique:true
    },
    password: {
      type: Sequelize.DataTypes.STRING,
    },
    is_admin: {
      type: Sequelize.DataTypes.INTEGER,
      defaultValue: null
   
    },
    is_block: {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false
    },

  }, 
  {
    
      freezeTableName: true,
      deletedAt: 'destroyTime', 
      paranoid: true
    
  }
);

module.exports = Admin;