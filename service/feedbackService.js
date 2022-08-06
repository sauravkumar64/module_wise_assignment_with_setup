const Model = require("../model");
const { Op } = require("sequelize");

exports.addFeed = (data) => {
  return new Promise((resolve, reject) => {
    Model.feedback
      .create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log(`User is Unable to Add Feedback: ${error}`);
      });
  });
};

exports.findFeed = (data) => {
  return new Promise((resolve, reject) => {
    return Model.feedback
      .findOne({
        where: {
          id: data.id,
        },
      })

      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.findFeedBack = (data) => {
  return new Promise((resolve, reject) => {
    Model.feedback
      .findOne({
        where: {
          id: data.id,
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.deleteFeed = (data) => {
  return new Promise((resolve, reject) => {
    Model.feedback
      .destroy({
        where: {
          [Op.and]: [{ id: data.id, uId: data.adminId }],
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
exports.getcomment = () => {
  return new Promise((resolve, reject) => {
    Model.feedback
      .findAndCountAll({
        attributes: {
          exclude: ["rating"],
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.getratting = (data) => {
  return new Promise((resolve, reject) => {
    Model.feedback
      .findAndCountAll({
        where: {
          rating: data.rating,
        },
        attributes: {
          exclude: ["comment"],
        },
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};
