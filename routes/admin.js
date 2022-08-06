var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const Admin = require("../models");
const auth_admin = require("../middleware/validateToken.js");
const sendResponse = require("../Helper/sendResponse");
const adminController = require("../controllers/adminController");

router.post("/login", (req, res) => {
	return sendResponse.executeMethod(adminController.login, req.body, req, res);
});
router.post("/forgot-password",auth_admin, (req, res) => {
	return sendResponse.executeMethod(adminController.forgotPassword, req.body, req, res);
});
router.get("/generatePassword",auth_admin, async (req, res) => {
	try {
		await adminController.validateToken(req.query);

		res.render("change-password-admin", {
			token: req.query.token,
			email: req.query.email
		});
	} catch (err) {
		if (err) {
			return sendResponse.sendErrorMessage(err && err.isJoi ? err.details[0].message : err.message, {}, res);
		} else {
			res.render("link-expired");
		}
	}
});
router.get("/password-success",auth_admin, async (req, res) => {
	try {
		res.render("password-success");
	} catch (err) {
		if (err) {
			return sendResponse.sendErrorMessage(err && err.isJoi ? err.details[0].message : err.message, {}, res);
		} else {
			res.render("link-expired");
		}
	}
});
router.put("/reset-password",auth_admin, (req, res) => {
	return sendResponse.executeMethod(adminController.resetNewPassword, req.body, req, res);
});

router.post("/",auth_admin, (req, res) => {
	return sendResponse.executeMethod(adminController.addAdmin, req.body, req, res);
});

router.put("/", authentication,auth_admin, async (req, res) => {
	return sendResponse.executeMethod(adminController.updateAdmin, req.body, req, res);
});

router.get("/list", authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(adminController.getAllAdmins, payload, req, res);
});

router.get("/adminDetail/:id", authentication, (req, res) => {
	return sendResponse.executeMethod(adminController.getAdminById, req.params, req, res);
});

router.put("/block", authentication,auth_admin, (req, res) => {
	return sendResponse.executeMethod(adminController.updateAdmin, req.body, req, res);
});

router.delete("/", authentication,auth_admin, (req, res) => {
	let payload = req.body;
	payload.isDeleted = 1;
	return sendResponse.executeMethod(adminController.updateAdmin, payload, req, res);
});
router.get("/profile", authentication, (req, res) => {
	let token = req.credentials;
	return sendResponse.executeMethod(adminController.getAdminProfile, token.id, req, res);
});
router.put("/profile/change-password", authentication,auth_admin, async (req, res) => {

	let tokenData = req.credentials;
	let payload = req.body;
	payload.id = tokenData.id;
	return sendResponse.executeMethod(adminController.resetPassword, payload, req, res);
});

router.put("/edit-profile", authentication,auth_admin, async (req, res) => {

	let payload = req.body;
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(adminController.updateAdmin, payload, req, res);
});

router.put("/logout", authentication, (req, res) => {

	let token = req.credentials;
	return sendResponse.executeMethod(adminController.logout, token, req, res);
});

module.exports = router;
