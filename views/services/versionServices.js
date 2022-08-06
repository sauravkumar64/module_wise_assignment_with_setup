const { sequelize } = require("../dbConnection");
const Models = require("../models");

exports.getAppDetails = (criteria, projection) => {
  return new Promise((resolve, reject) => {
    Models.version
      .findAll({
       /* A promise. */
        where: criteria,
        attributes: projection,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

exports.appVersionDetails=(criteria, projection)=>{
  return new Promise ((resolve, reject) => {
    Models.version
    .findAll({
    where: criteria,
    attributes: projection,
  })
  .then((res) => {
    resolve(res);
  })
  .catch((err) => reject(err));
  });
}

// exports.getVersionDetails = (criteria, projection) => {
//   return new Promise((resolve, reject) => {
//     Models.user
//       .findAll({
//         where: criteria,
//         attributes: projection,
//       })
//       .then((res) => {
//         resolve(res);
//       })
//       .catch((err) => reject(err));
//   });
// };

// exports.getPlateformDetails = (criteria, projection) => {
//   return new Promise((resolve, reject) => {
//     Models.user
//       .findAll({
//         where: criteria,
//         attributes: projection,
//       })
//       .then((res) => {
//         resolve(res);
//       })
//       .catch((err) => reject(err));
//   });
// };

exports.addAppDetails = (objToSave) => {
  return new Promise((resolve, reject) => {
    Models.version
      .create(objToSave)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

exports.checkVersion = (criteria) => {
  return new Promise((resolve, reject) => {
    Models.version
      .findOne({
        where: criteria,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

exports.countAppVersion = (criteria) => {
  return new Promise((resolve, reject) => {
   Models.version.findAndCountAll({  where:criteria })
      .then((res) => {
      
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

exports.updateIsDeleted = (criteria,objToSave) => {
  return new Promise((resolve, reject) => {
    Models.version.update(objToSave,{
     where :criteria
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

exports.getPlatform = (criteria, projection) => {
  return new Promise((resolve, reject) => {
    Models.version
      .findAll({
        where: criteria,
        attributes: projection,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

exports.getAppDetail = (criteria, projection) => {
  return new Promise((resolve, reject) => {
    Models.version
      .findAll({
        where: criteria,
        attributes: projection,
      })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};


exports.deleteAppVersion = (criteria) => {
  return new Promise((resolve, reject) => {
    Models.version.destroy({ where: criteria })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};

exports.editDetails = (criteria, objToUpdate) => {
  return new Promise((resolve, reject) => {
    Models.version.update(objToUpdate, { where: criteria })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => reject(err));
  });
};