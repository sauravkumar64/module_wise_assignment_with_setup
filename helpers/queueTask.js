"use strict";
var Service = require("../services");
const Response = require("../config/response");
var saveTask = async (payloadData) => {
	var dataToSave = {
		methodName: payloadData.methodName,
		type: payloadData.type,
		status: payloadData.status
	};
	let createSession = await Service.QueueTaskServices.saveData(dataToSave);
	if (!createSession) throw Response.error_msg.implementationError;
};
module.exports = {
	saveTask: saveTask,
};