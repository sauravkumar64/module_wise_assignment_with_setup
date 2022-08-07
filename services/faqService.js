"use strict";
//const Sequelize = require("sequelize");
//const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
//const appConstants = require("../config/appConstants");
//const baseService = require("./base");

/**
 * ######### @function getAdmin ########
 * ######### @params => criteria, projection  ########
 * ######### @logic => Used to retrieve specific admin ########
 */
exports.addfaq = (objTosave) => {
  return new Promise((resolve, reject) => {
    Models.faqlist
      .create(objTosave)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        console.log("get err ==>>  ", err);
        reject(Response.error_msg.implementationError);
      });
  });
};

exports.getfaq = (criteria, projection) => {
  return new Promise((resolve, reject) => {
    Models.faqlist
      .findAll({
        where: criteria,
        attributes: projection,
      })
      .then(result => {
				resolve(result);
			}).catch(err => {
				console.log("get err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.countfaq = (criteria) => {
  return new Promise((resolve, reject) => {
   Models.faqlist.findAndCountAll({  where:criteria })
   .then(result => {
    resolve(result);
  }).catch(err => {
    console.log("get err ==>>  ", err);
    reject(Response.error_msg.implementationError);
  });
});
};


exports.updatefaq = (criteria, objToUpdate) => {
  return new Promise((resolve, reject) => {
    Models.faqlist
      .update(objToUpdate, { where: criteria })
      .then(result => {
				resolve(result);
			}).catch(err => {
				console.log("get err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
}

exports.updatestatus = (criteria, objToUpdate) => {
  return new Promise((resolve, reject) => {
    Models.faqlist
      .update(objToUpdate, { where: criteria })
      .then(result => {
				resolve(result);
			}).catch(err => {
				console.log("get err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
}

exports.filterusername = (criteria, projection) => {
  return new Promise((resolve, reject) => {
    Models.faqlist
      .findAll({
        where: criteria,
        attributes: projection,
      })
      .then(result => {
				resolve(result);
			}).catch(err => {
				console.log("get err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.filterstatus = (criteria, projection) => {
  return new Promise((resolve, reject) => {
    Models.faqlist
      .findAll({
        where: criteria,
        attributes: projection,
      })
      .then(result => {
				resolve(result);
			}).catch(err => {
				console.log("get err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.editfaq = (criteria, objToUpdate) => {
  return new Promise((resolve, reject) => {
    Models.faqlist.update(objToUpdate, { where: criteria })
    .then(result => {
      resolve(result);
    }).catch(err => {
      console.log("get err ==>>  ", err);
      reject(Response.error_msg.implementationError);
    });
});
};

exports.updateIsDeleted = (criteria,objToSave) => {
  return new Promise((resolve, reject) => {
    Models.faqlist.update(objToSave,{
     where :criteria
    })
    .then(result => {
      resolve(result);
    }).catch(err => {
      console.log("get err ==>>  ", err);
      reject(Response.error_msg.implementationError);
    });
});
};

exports.deletefaq = (criteria) => {
  return new Promise((resolve, reject) => {
    Models.faqlist.destroy({ where: criteria })
    .then(result => {
      resolve(result);
    }).catch(err => {
      console.log("get err ==>>  ", err);
      reject(Response.error_msg.implementationError);
    });
});
};

