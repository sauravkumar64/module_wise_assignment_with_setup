"use strict";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.ReportedItem, objToSave);
};
exports.getList = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		console.log(criteria,"??????");
		let where = {};
		where.isDeleted = 0;
		let order = [
			["createdAt", "DESC"]
		];
		if (criteria.sortBy && criteria.orderBy) {
			order = [
				[criteria.sortBy, criteria.orderBy]
			];
		}
		if (criteria && criteria.search) {
			where = {
				type: {
					[Op.like]: "%" + criteria.search + "%"
				}
			};
		}
		console.log(where,"??????");
		Models
			.UserActivity
			.findAndCountAll({
				limit,
				offset,
				where: where,
				attributes: projection,
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};