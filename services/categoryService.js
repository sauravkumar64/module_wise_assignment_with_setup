const { Op } = require("sequelize");
const Models = require("../models");

Models.categoryModel.hasMany(Models.subCategoryModel, {
  foreignKey: "parentCid",
});
//------- find all or filtered categories -------
exports.findAllCategories = () => {
  return new Promise((resolve, reject) => {
    Models.categoryModel
      .findAndCountAll({
        attributes: ["cId", "name"],
        include: [
          {
            model: Models.subCategoryModel,
            attributes: ["scId", "name", "image", "parentCid"],
          },
        ],
      })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};

//---------- filter categories by name ---------

exports.getFilteredCategories = (data) => {
  return new Promise((resolve, reject) => {
    Models.categoryModel
      .findOne({
        attributes: ["cId", "name"],
        include: [
          {
            model: Models.subCategoryModel,
          },
        ],
        where: {
          [Op.and]: [{ name: data.name, deletedAt: null }],
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

exports.findCategory = (data) => {
  return new Promise((resolve, reject) => {
    Models.categoryModel
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
    Models.categoryModel
      .create(data)
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
  // return Models.categoryModel.create(data);
};

//--------- Delete  Sub-Categories --------

exports.findSubCategory = (data) => {
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
exports.deleteCategory = (obj) => {
  return new Promise((resolve, reject) => {
    Models.subCategoryModel
      .destroy({
        where: {
          [Op.and]: [{ scId: obj.scId }, { parentCid: obj.parentCid }],
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

//--------- update category ------------
exports.update = (newdata) => {
  return new Promise((resolve, reject) => {
    Models.categoryModel
      .update(
        {
          name: newdata.name,
        },
        {
          where: {
            cId: newdata.cId,
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
    Models.categoryModel
      .findOne({
        where: {
          cId: data.cId,
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
