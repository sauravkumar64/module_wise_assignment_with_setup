const _ = require("underscore");
//const moment = require("moment");
const Joi = require("joi");
//const appConstants = require("../config/appConstants");
const Response = require("../config/response");
let commonHelper = require("../helpers/common");
let config = require("../config/env")();
//let message = require("../config/messages");
let Services = require("../services");
//const privateKey = config.APP_URLS.PRIVATE_KEY_ADMIN;
//let TokenManager = require("../helpers/adminTokenManager");
//let NotificationManager = require("../helpers/mailer");
let faqProjection = ["id", "username", "faq", "status"];
module.exports = {
	addfaq: async(payloadData) => {
		const schema = Joi.object().keys({
			username: Joi.string().min(3).max(30).required(),
			faq: Joi.string().min(5).max(300).required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		if(!payload){
			throw Response.error_msg.emailNotFound;
		}
		else 
		{
			let dataToSave = {
			username: payload.username,
			faq:payload.faq
			};
			let addfaq = await Services.faqService.addfaq(dataToSave);
			return addfaq;
		}
	},
	getAllfaq: async(payloadData) => {
		//let criteria = {}
		let faqs = await Services.faqService.getAllAdmins(payloadData, faqProjection);
		if (faqs) {
			return faqs;
		} else {
			throw Response.error_msg.recordNotFound;
		}
	},
	filterusername: async (payloadData) => {
    let criteria = { username: payloadData.username };
    let faqs = await Services.faqService.filterusername(criteria,faqProjection);
		if (faqs) {
    return faqs;
	} else {
		throw Response.error_msg.recordNotFound;
	}
  },

  filterstatus: async (payloadData) => {
    let criteria = { status: payloadData.status};
    let faqs = await Services.faqService.filterstatus(criteria,faqProjection);
			if (faqs) {
    return faqs
	} else {
		throw Response.error_msg.recordNotFound;
	}
  },

  editfaq: async (payloadData) => {
    let dataToUpdate = {};
    if (payloadData && payloadData.username) dataToUpdate.username  = payloadData.username;
    if (payloadData&& payloadData.faq) dataToUpdate.faq = payloadData.faq;
    if (payloadData&& payloadData.status) dataToUpdate.status = payloadData.status;
    let criteria = {
      id: payloadData.id,
    };
    let saveEditfaq = await Services.faqService.editfaq(criteria,dataToUpdate);
		if (saveEditfaq) {
		return saveEditfaq
	} else {
		throw Response.error_msg.recordNotFound;
	}
  },

  updatestatus: async (payloadData) => {
    let dataToUpdate = {};
    if (payloadData && payloadData.status) dataToUpdate.status = payloadData.status;
    let criteria = {
      id: payloadData.id,
    };
    let saveEditfaq = await Services.faqService.updatestatus(criteria,dataToUpdate);
		if (saveEditfaq) {
		return saveEditfaq
	} else {
		throw Response.error_msg.recordNotFound;
	}
  },

  deletefaq: async (payloadData) => {
    let criteria = {id: payloadData.id};
		    objectToSave = {isDeleted: true};
    let DeletedData = await Services.faqService.deletefaq(criteria,dataToSave);
		if (DeletedData) {
		return DeletedData
	} else {
		throw Response.error_msg.recordNotFound;
	}
  },

  countfaq: async (payloadData) => {
    let criteria = {};
    let countfaq = await Services.faqService.countfaq(criteria);
    if (countfaq) {
		return countfaq
	} else {
		throw Response.error_msg.recordNotFound;
	}
  }, 
};