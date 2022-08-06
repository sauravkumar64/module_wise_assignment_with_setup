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
//let adminProjection = ["id", "firstName", "lastName", "email", "countryCode", "phoneNumber", "adminType", "image", "isBlocked", "createdAt"];
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
		}
	}