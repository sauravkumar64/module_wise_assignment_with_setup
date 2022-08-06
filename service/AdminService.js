const Model = require("../model");
const { Op } = require("sequelize");

exports.getAdmin = (data) => {
  return new Promise((resolve, reject) => {
    Model.AdminRegister.findOne({
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

exports.addAdmin = (data) => {
  return new Promise((resolve,reject)=>{
    Model.AdminRegister.create(data)
   .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        console.log("getAll err ==>>  ", error);
      });
    })
};

//delete a person
exports.deleteperson = (data) => {
  return new Promise((resolve,reject)=>{
    Model.AdminRegister.destroy({
      where: { adminId: data.adminId },
    }).then((result) => {
      resolve(result);
    })
    .catch((error) => {
      console.log("getAll err ==>>  ", error);
    });
  })
};

//update the person

//firstly find the person

exports.get = (data) => {
  return new Promise((resolve,reject)=>{
    Model.AdminRegister.findOne({
      where: { adminId: data.adminId },
    }).then((result) => {
      resolve(result);
    })
    .catch((error) => {
      console.log("getAll err ==>>  ", error);
    });
  })
};
//block the person
exports.blockperson = (data) => {
  return new Promise((resolve,reject)=>{
    Model.AdminRegister.update(
      { Isblocked: 1 },
      { where: { adminId: data.adminId } }
    ).then((result) => {
      resolve(result);
    })
    .catch((error) => {
      console.log("getAll err ==>>  ", error);
    });
  })
};

//unblock person
exports.unblockperson = (data) => {
  return new Promise((resolve,reject)=>{
    Model.AdminRegister.update(
      { Isblocked: 0 },
      { where: { adminId: data.adminId } }
    ).then((result) => {
      resolve(result);
    })
    .catch((error) => {
      console.log("getAll err ==>>  ", error);
    });
  })
};

//Edit the user
exports.edit = (d) => {
  return new Promise((resolve,reject)=>{
    Model.AdminRegister.update(
      {
        adminId: d.adminId,
        RegistrationPermission: d.RegistrationPermission,
        BlockedPermission: d.BlockedPermission,
        UnblockedPermission: d.UnblockedPermission,
        DeletedPermission: d.DeletedPermission,
        EditPermission: d.EditPermission,
      },
      {
        where: { adminId: d.adminId },
      }
    ) .then((result) => {
      resolve(result);
    })
    .catch((error) => {
      console.log("getAll err ==>>  ", error);
    });
  })
};

exports.getAllAdmins = (criteria, projection, limit, offset) => {
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
  if (criteria && criteria.title) {
    where.title = criteria.title;
  }
  where.destroyTime = null;
  if (criteria["Isblocked"] === 1) where.Isblocked = 1;
  return new Promise((resolve, reject) => {
    Model.AdminRegister.findAndCountAll({
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


