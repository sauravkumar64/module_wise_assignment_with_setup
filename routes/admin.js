var express = require("express");
var router = express.Router();
const sendResponse = require("../Helper/sendResponse");
const adminController = require("../controllers/adminController");
const authentication = require("../middleware/adminAuthentication").verifyToken;


router.post("/",(req, res) => {
	return sendResponse.executeMethod(adminController.addAdmin, req.body, req, res);
});

router.put("/reset-password", (req, res) => {
	return sendResponse.executeMethod(adminController.resetNewPassword, req.body, req, res);
});

router.post("/login", (req, res) => {
	return sendResponse.executeMethod(adminController.login, req.body, req, res);
});

router.put("/logout", authentication,(req, res) => {

	let token = req.credentials;
	return sendResponse.executeMethod(adminController.logout, token, req, res);
});

router.get("/list-admins", authentication, (req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(adminController.getAllAdmins, payload, req, res);
});


module.exports = router;
