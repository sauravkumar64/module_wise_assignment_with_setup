const Sequelize = require("sequelize");
const sequelize = new Sequelize("admins", "root", "Vaneet5509@", {
  host: "localhost",
  dialect: "mysql",
  port:"3307",
  logging:false,
});
const connect = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connected with database");
    })
    .catch((err) => {
      console.log("Error", err);
    });
};
// add the  model to your database. To do that, you’ll use the sync()
const syn = () => {
  sequelize.sync({ alter: true }).then(() => {
    console.log("Sync");
  });
};


//connect and syn file is used in app.js file and sequelize is used to models tables

module.exports = { sequelize: sequelize, connect: connect, syn: syn };
