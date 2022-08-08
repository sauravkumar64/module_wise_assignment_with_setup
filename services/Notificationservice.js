const Models = require("../models");
const { Op } = require("sequelize");


exports.add = (data) => {
  return Models.Notificationlist.create(data);
};

exports.findblocked = () => {
  return Models.Notificationlist.findAndCountAll({
    where: { destroyTime: null },
    attributes: { exclude: ["password", "deleted"] },
  });
};

exports.findIOS = () => {
  return Models.Notificationlist.findAndCountAll({
    where: { platform: "Android" },
    attributes: {
      exclude: ["adminId", "password", "createdAt", "updatedAt", "destroyTime"],
    },
  });
};

exports.findAndroid = () => {
  return Models.Notificationlist.findAndCountAll({
    where: { platform: "IOS" },
    attributes: {
      exclude: [
        "adminId",
        "password",
        "deleted",
        "createdAt",
        "updatedAt",
        "destroyTime",
      ],
    },
  });
};

exports.view = () => {
  return Models.Notificationlist.findAll({
    attributes: {
      exclude: ["password", "blocked", "deleted"],
    },
  });
};

exports.viewperson = (data) => {
  return Models.Notificationlist.findOne({
    where: { notificationId: data.notificationId },
  });
};

exports.edit = (data) => {
  return Models.Notificationlist.update(
    {
      notification: data.notification,
      platform: data.platform,
    },
    {
      where: { notificationId: data.notificationId },
    }
  );
};

exports.deleteperson = (data) => {
  return Models.Notificationlist.destroy({
    where: { notificationId: data.notificationId },
  });
};