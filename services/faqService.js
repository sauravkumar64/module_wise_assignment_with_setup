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
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("get err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};
