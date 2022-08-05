"use strict";
var Service = require("../services");
const Response = require("../config/response");
const messages = require("../config/messages");
var setTokenInDB = async (userId, tokenData) => {
	var dataToSave = {
		userId: userId,
		deviceToken: tokenData.deviceToken,
		deviceType: tokenData.deviceType,
	};
	let condition = {
		userId: userId,
		deviceToken: tokenData.deviceToken
	};
	// let sessionExist = await Service.SessionsService.getSessionDetail(condition, ['id']);
	await Service.SessionsService.deleteSessions(condition);
	let createSession = await Service.SessionsService.saveSessionData(dataToSave);
	if (!createSession) throw Response.error_msg.implementationError;
};
var expireTokenInDB = async (userId, deviceToken) => {
	let condition = {
		userId: userId,
		deviceToken: deviceToken
	};
	let removeSession = await Service.SessionsService.deleteSessions(condition);
	if (!removeSession) throw Response.error_msg.implementationError;
	else return removeSession;
};
var setToken = (tokenData, callback) => {
	if (!tokenData.id) {
		callback(Response.error_msg.implementationError);
	} else {
		// var tokenToSend = Jwt.sign(tokenData, privateKey);
		setTokenInDB(tokenData.id, tokenData);
		callback();
	}
};
var expireToken = (token, deviceToken, callback) => {
	expireTokenInDB(token.id, deviceToken);
	callback(null, messages.success.LOGOUT);
};
module.exports = {
	expireToken: expireToken,
	setToken: setToken,
};