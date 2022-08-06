const Sequelize = require("sequelize");
const env = require("./config/env")();
var sequelize = new Sequelize(
	env.DATABASE.name,
	env.DATABASE.user,
	env.DATABASE.password, {
		host: env.DATABASE.host,
		dialect: "mysql",
	});
var connectDB = () => {
	sequelize.authenticate()
		.then(() => {
			sequelize.sync();
			console.log("Connection has been established successfully.");
		})
		.catch(err => {
			console.error("Unable to connect to the database:", err);
		});
};
module.exports = {
	connectDB: connectDB,
	sequelize: sequelize
};