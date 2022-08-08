var Sequelize = require("sequelize")

var sequelize = new Sequelize(
  "nodedb",
  "root",
  "Burgerking@626",
  {
    host: 'localhost',
    dialect: 'mysql'  }
);

var connect = () => {
  sequelize.authenticate()
    .then(() => {
      sequelize.sync({alter: true});
      console.log("Connected Successfully")
    })
    .catch((err) => {
      console.log("Sequelize Connection Error:  ", err)
    });
}
module.exports = {
  sequelize: sequelize,
  connect: connect
}
