
const Model = require("../model");
const { Op } = require("sequelize");
exports.getAdmin = (data) => {
  return Model.userRegister.findOne({
    where: { email: data.email },
  });
};

exports.addAdmin = (data) => {
  return Model.userRegister.create(data);
};


exports.deleteperson = (data) => {
  return Model.userRegister.destroy({
    where: { name: data.name },
  });
};

exports.get = (data) => {
  return Model.userRegister.findOne({
    where: { name: data.name },
  });
};

exports.blockperson = (data) => {
  return Model.userRegister.update(
    { Isblocked: 1 },
    { where: { name: data.name } }
  );
};

exports.unblockperson = (data) => {
  return Model.userRegister.update(
    { Isblocked: 0 },
    { where: { name: data.name } }
  );
};


exports.detailUser = (criteria, projection, limit, offset) => {
  let where = {};
  let order = [
    [
      criteria.sortBy ? criteria.sortBy : "createdAt",
      criteria.orderBy ? criteria.orderBy : "DESC",
    ],
  ];
  if (criteria && criteria.search) {
    where = {
      [Op.or]: {
        name: {
          [Op.like]: "%" + criteria.search + "%",
        },
        email: {
          [Op.like]: "%" + criteria.search + "%",
        },
      },
    };
  }
  // if (criteria && criteria.title) {
  //   where.title = criteria.title;
  // }
  where.destroyTime = null;
  if (criteria["Isblocked"] === 1) where.Isblocked = 1;
  return new Promise((resolve, reject) => {
    Model.userRegister.findAndCountAll({
      limit,
      offset,
      where: where,
      order: order,
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
  });
};




