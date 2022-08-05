"use strict";
const _ = require("underscore");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Models = require("../models");
const Response = require("../config/response");
const baseService = require("./base");

// var moment = require("moment");
Models.UserSocialAccounts.belongsTo(Models.Users, {
	foreignKey: "userId",
	as: "user"
});
Models.Users.hasOne(Models.UserSocialAccounts, {
	foreignKey: "userId",
	as: "userSocialAccounts"
});
Models.Users.hasOne(Models.Sessions, {
	foreignKey: "userId",
	as: "userSession"
});

exports.saveData = async (objToSave) => {
	return await baseService.saveData(Models.Users, objToSave);
};
exports.saveSocialData = async(objToSave) => {
	return await baseService.saveData(Models.UserSocialAccounts, objToSave);
	
};
exports.updateData = async (criteria, objToSave,) => {
	return await baseService.updateData(Models.Users, criteria, objToSave);
};
exports.delete = async (criteria) => {
	return await baseService.delete(Models.Users, criteria);
};
exports.groupCount = (groupByColumn) => {
	return new Promise((resolve, reject) => {
		let where = {};
		where.isDeleted = 0;
		Models
			.Users
			.findAll({
				attributes: [
					[Sequelize.fn("COUNT", groupByColumn), "Count"]
					// [Sequelize.literal(`any_value(count('${groupByColumn}'))`), "Count"]
					, groupByColumn
				],
				where: where,
				group: groupByColumn
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.count = async (criteria) => {
	let where = {};
	
	if (criteria && (criteria.isBlocked !== undefined)) {
		where.isBlocked = criteria.isBlocked;
	}
	return await baseService.count(Models.Users, where);
};
exports.getUsers = async(criteria, projection) => {
	return await baseService.getSingleRecord(Models.Users, criteria, projection);

};
exports.getUsersBySocialId = (criteria, projection) => {
	return new Promise((resolve, reject) => {
		Models
			.UserSocialAccounts
			.findOne({
				where: criteria,
				attributes: projection,
				include: [{
					model: Models.Users,
					as: "user",
					projection: ["id", "email", "deviceToken", "platformType", "isBlocked"],
					required: true
				}]
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.listUsers = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let whereSocialId = {
			isDeleted: 0
		};
		let includeSocialIdModel = false;
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
				[Op.or]: {
					firstName: {
						[Op.like]: "%" + criteria.search + "%"
					},
					lastName: {
						[Op.like]: "%" + criteria.search + "%"
					},
					email: {
						[Op.like]: "%" + criteria.search + "%"
					}
				}
			};
		}
		where.isDeleted = 0;
		if (_.has(criteria, "loginType")) {
			whereSocialId.loginType = criteria.loginType;
			includeSocialIdModel = true;
		}
		if (_.has(criteria, "isBlocked")) {
			where.isBlocked = criteria.isBlocked;
		}
		Models
			.Users
			.findAndCountAll({
				limit,
				offset,
				where: where,
				attributes: projection,
				include: [{
					model: Models.UserSocialAccounts,
					attributes: ["id", "loginType"],
					where: whereSocialId,
					as: "userSocialAccounts",
					required: includeSocialIdModel
				}],
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getUsersList = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
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
				[Op.or]: {
					firstName: {
						[Op.like]: "%" + criteria.search + "%"
					},
					lastName: {
						[Op.like]: "%" + criteria.search + "%"
					}
				}
			};
		}
		if (criteria && criteria.referredBy) {
			where.referredBy = criteria.referredBy;
		}
		if (criteria && (_.has(criteria, "referralUserCountGT"))) {
			where.referralUserCount = {
				[Op.gt]: criteria.referralUserCountGT
			};
		}
		if (criteria && (_.has(criteria, "averageFeedbackGT"))) {
			where.averageFeedback = {
				[Op.gt]: criteria.averageFeedbackGT
			};
		}
		if (criteria && (_.has(criteria, "isBlocked"))) {
			where.isBlocked = criteria.isBlocked;
		}
		where.isDeleted = 0;
		Models
			.Users
			.findAll({
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
exports.listCountries = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		where.isDeleted = 0;
		Models
			.Countries
			.findAndCountAll({
				limit,
				offset,
				where: where,
				attributes: projection,
			})
			.then(result => {
				resolve(result);
			})
			.catch(err => {
				console.log(err);
				reject(err);
			});
	});
};
exports.saveNotificationSettings = async(objToSave) => {
	return await baseService.saveData(Models.UserNotificationSettings, objToSave);


};
exports.updateSocialAccounts = async(criteria, objToSave) => {
	return await baseService.updateData(Models.UserSocialAccounts, criteria, objToSave);

};
exports.updateNotificationSettings = async(criteria, objToSave) => {
	return await baseService.updateData(Models.UserNotificationSettings, criteria, objToSave);

};
exports.getGroupByList = (criteria, sequelizeFunction, groupColumn) => {
	let start = new Date(criteria.startDate);
	start = start.setHours(0, 0, 0, 0);
	let end = new Date(criteria.endDate);
	end = end.setHours(23, 59, 59, 999);
	let where = {};
	where = {
		[Op.and]: [{
			createdAt: {
				[Op.between]: [start, end]
			}
		}, ]
	};
	where.isDeleted = 0;
	if (criteria && criteria.isBlocked === 0) {
		where.isBlocked = 0;
	}
	return new Promise((resolve, reject) => {
		Models.Users.count({
			attributes: [
				[Sequelize.fn(sequelizeFunction, Sequelize.col(groupColumn)), sequelizeFunction],
				[Sequelize.fn("count", Sequelize.col("id")), "count"]
			],
			where: where,
			group: [Sequelize.fn(sequelizeFunction, Sequelize.col(groupColumn))]
		})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("count err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.getGroupByListByTypes = (criteria, sequelizeFunction, groupColumn, typeColumn) => {
	let start = new Date(criteria.startDate);
	start = start.setHours(0, 0, 0, 0);
	let end = new Date(criteria.endDate);
	end = end.setHours(23, 59, 59, 999);
	let where = {};
	where = {
		[Op.and]: [{
			createdAt: {
				[Op.between]: [start, end]
			}
		}, ]
	};
	where.isDeleted = 0;
	if (criteria && criteria.isBlocked === 0) {
		where.isBlocked = 0;
	}
	return new Promise((resolve, reject) => {
		Models.Users.count({
			attributes: [
				[Sequelize.fn(sequelizeFunction, Sequelize.col(groupColumn)), sequelizeFunction],
				[Sequelize.fn("count", Sequelize.col("id")), "count"],
				typeColumn
			],
			where: where,
			group: [Sequelize.fn(sequelizeFunction, Sequelize.col(groupColumn)), typeColumn]
		})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("count err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.countData = (criteria) => {
	let where = {};
	// eslint-disable-next-line quotes
	if (`startDate` in criteria && `endDate` in criteria) {
		where[Op.and] = [{
			createdAt: {
				[Op.gt]: criteria.startDate
			}
		}, {
			createdAt: {
				[Op.lte]: criteria.endDate
			}
		}];
		//  where.isBlocked=0;
	}
	if (criteria && criteria.isBlocked === 0) {
		where.isBlocked = 0;
	}
	where.isDeleted = 0;
	return new Promise((resolve, reject) => {
		Models.Users.count({
			where: where,
			distinct: true,
			col: "id"
		})
			.then(result => {
				resolve(result);
			}).catch(err => {
				console.log("count err ==>>  ", err);
				reject(Response.error_msg.implementationError);
			});
	});
};
exports.listUserSession = (criteria, projection, limit, offset) => {
	return new Promise((resolve, reject) => {
		let where = {};
		let order = [
			["createdAt", "DESC"]
		];
		if (criteria && criteria.search) {
			where = {
				[Op.or]: {
					firstName: {
						[Op.like]: "%" + criteria.search + "%"
					},
					lastName: {
						[Op.like]: "%" + criteria.search + "%"
					},
					email: {
						[Op.like]: "%" + criteria.search + "%"
					}
				}
			};
		}
		where.isDeleted = 0;
		Models
			.Users
			.findAndCountAll({
				limit,
				offset,
				where: where,
				attributes: projection,
				include: [{
					model: Models.Sessions,
					attributes: ["id", "deviceToken", "deviceType"],
					// where: whereSocialId,
					as: "userSession",
					// required: includeSocialIdModel
				}],
				order: order,
			}).then(result => {
				resolve(result);
			}).catch((err) => {
				console.log(err);
				reject(Response.error_msg.implementationError);
			});
	});
};

exports.createContactUs =async (objToSave ) => {
	return await baseService.saveData(Models.ContactUs, objToSave);

};