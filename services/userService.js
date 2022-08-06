//const { Promise } = require("sequelize");
const Models = require("../models");

exports.findUser = (data) => {
  return new Promise((resolve, reject) => {
    Models.userModel
      .findOne({
        where: { email: data.email },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.addUser = (data) => {
  return new Promise((resolve, reject) => {
    Models.userModel
      .create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.getUser = (uId) => {
  return new Promise((resolve, reject) => {
    Models.userModel
      .findByPk(uId, {
        where: { exclude: "password" },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
