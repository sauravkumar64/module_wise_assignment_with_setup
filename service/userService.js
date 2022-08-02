
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

exports.findblocked = () => {
  return Model.userRegister.findAndCountAll({
    where: { destroyTime: null },
    attributes: { exclude: ["password", "blocked", "deleted"] },
  });
};
exports.findNotblocked = () => {
  return Model.userRegister.findAndCountAll({
    where: { Isblocked: 0 },
    attributes: { exclude: ["adminId","IsAdmin","password", "blocked", "deleted","Isblocked","IsPermission","createdAt","updatedAt","destroyTime"] },
  });
};
exports.findNotblockeds = () => {
  return Model.userRegister.findAndCountAll({
    where: { Isblocked: 1 },
    attributes: { exclude: ["adminId","IsAdmin","password", "blocked", "deleted","Isblocked","IsPermission","createdAt","updatedAt","destroyTime"] },
  });
};

//view all
exports.view = () => {
  return Model.userRegister.findAll({
    attributes: {
      exclude: ["adminId", "email", "password", "blocked", "deleted"],
    },
  });
};
//view specific person
exports.viewperson = (data) => {
  return Model.userRegister.findOne({
    where: { name: data.name },
  });
};

//delete a person
exports.deleteperson = (data) => {
  return Model.userRegister.destroy({
    where: { name: data.name },
  });
};

//update the person

//firstly find the person

exports.get = (data) => {
  return Model.userRegister.findOne({
    where: { name: data.name },
  });
};
//block the person
exports.blockperson = (data) => {
  return Model.userRegister.update(
    { Isblocked: 1 },
    { where: { name: data.name } }
  );
};

//unblock person
exports.unblockperson = (data) => {
  return Model.userRegister.update(
    { Isblocked: 0 },
    { where: { name: data.name } }
  );
};

//login column update
exports.updatelogin = (data) => {
  return Model.userRegister.update(
    { IsLogIn: 1 },
    { where: { email: data.email } }
  );
};



