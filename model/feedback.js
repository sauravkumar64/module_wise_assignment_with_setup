const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionDB").sequelize;

const Feedback = sequelize.define(
    "Feedbacknotification",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        required: true,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
  
      comment: {
        type: DataTypes.STRING,
        required: true,
      },
  
      rating: {
        type: DataTypes.STRING,
        required: true,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      deletedAt: 'destroyTime', 
    }
  );
  module.exports = Feedback;