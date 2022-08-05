var express = require("express");
var router = express.Router();
const Controllers = require("../controllers");
const sendResponse = require("../helpers/sendResponse");
const authentication = require("../middleWares/authentication").verifyToken;
router.post("/signUp", (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.registerUser, req.body, req, res);
});
router.put("/verifyEmail", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.verifyEmail, req, req, res);
});

router.put("/verifyPhoneNumber", (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.verifyPhoneNumber, req, req, res);
});

router.put("/resendEmailForVerification", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.sendEmailForVerification, req.credentials, req, res);
});

router.put("/resendOtpForVerification", authentication, (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.sendMessageForVerification, req.credentials, req, res);
});
router.post("/login", (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.loginUser, req.body, req, res);
});

router.post("/socialLogin", (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.socialLogin, req.body, req, res);
});

router.put("/registerUser", authentication, (req, res) => {
	let payload = req.body || {};
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UsersController.createProfile, payload, req, res);
});

router.put("/forgotPassword", (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.forgotPassword, req.body, req, res);
});

router.get("/generatePassword", async (req, res) => {
	try {
		await Controllers.UsersController.validateToken(req.query);
		res.render("change-password-user", {
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
router.get("/passwordSuccess", async (req, res) => {
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
router.put("/resetEmailPassword", (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.resetPassword, req.body, req, res);
});

router.put("/verifyForgetPasswordOtp", (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.verifyForgetPasswordOtp, req.body, req, res);
});
router.put("/resetPassword", (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.resetPassword, req.body, req, res);
});

router.put("/changePassword", authentication, (req, res) => {
	let payload = req.body || {};
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UsersController.changePassword, payload, req, res);
});
router.put("/logout", authentication, async (req, res) => {
	try {
		let payload = req.body || {};
		let data = await Controllers.UsersController.logout(payload, req.credentials);
		return sendResponse.sendSuccessMessage("success", data, res);
	} catch (err) {
		console.log(err);
		return sendResponse.sendErrorMessage(err.isJoi ? err.details[0].message : err.message, {}, res);
	}
});

router.post("/uploadUrl", async (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.uploadUrl, req.body, req, res);
});

router.put("/", authentication, async (req, res) => {
	let payload = req.body || {};
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UsersController.updateUser, payload, req, res);
});

router.get("/", authentication, async (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.getUserDetail, req.credentials, req, res);
});

router.get("/referredUserList", authentication, async (req, res) => {
	let payload = req.query || {};
	payload.id = req.credentials.id;

	return sendResponse.executeMethod(Controllers.UsersController.referredUserList, payload, req, res);
});

router.delete("/", authentication, async (req, res) => {
	return sendResponse.executeMethod(Controllers.UsersController.deleteUser, req.credentials, req, res);
});

router.put("/notificationSettings", authentication, async (req, res) => {
	let payload = req.body || {};
	payload.id = req.credentials.id;
	return sendResponse.executeMethod(Controllers.UsersController.updateUserNotifications, payload, req, res);
});
module.exports = router;