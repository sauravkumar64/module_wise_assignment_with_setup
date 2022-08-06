const Models = require("../models");
const { Op } = require("sequelize");

//------ add sub category----------
exports.findSubCategory = (data) => {
  return new Promise((resolve, reject) => {
    Models.subCategoryModel
      .findOne({
        where: {
          name: data.name,
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

exports.addCategory = (data) => {
  return new Promise((resolve, reject) => {
    Models.subCategoryModel
      .create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

//--------update sub category -------
exports.update = (newdata) => {
  return new Promise((resolve, reject) => {
    Models.subCategoryModel
      .update(
        {
          name: newdata.name,
          image: newdata.image,
        },
        {
          where: {
            [Op.and]: [{ scId: newdata.scId, parentCid: newdata.parentCid }],
          },
        }
      )
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

exports.find = (data) => {
  return new Promise((resolve, reject) => {
    Models.subCategoryModel
      .findOne({
        where: {
          scId: data.scId,
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
