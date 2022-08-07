var express = require("express");
var router = express.Router();
const authentication = require("../middleWares/adminAuthentication").verifyToken;
const faqController = require("../controllers/faqController");
const sendResponse = require("../helpers/sendResponse");
//var multiPart = require("connect-multiparty");
//var multiPartMiddleware = multiPart();

router.post("/addfaq", (req, res) => {
	return sendResponse.executeMethod(faqController.addfaq, req.body, req, res);
});

router.get("/getallfaq", (req, res) => {
	return sendResponse.executeMethod(faqController.getAllfaq, req.params, req, res);
});

// To update a FAQ
router.put("/edit", (req, res) => {
	return sendResponse.executeMethod(faqController.editfaq, req.body, req, res);
});

//Admin can edit  FAQ, in which he/she can mark a faq as solved
router.put("/updatestatus", (req, res) => {
	return sendResponse.executeMethod(faqController.updatestatus, req.body, req, res);
});

//Admin can delete  FAQ
router.delete("/:id", (req, res) => {
	return sendResponse.executeMethod(faqController.deletefaq, req.param, req, res);
});

// filter FAQ’s by name of user who have created
router.get("/filterusername/:username", async (req, res) => {
	return sendResponse.executeMethod(faqController.filterusername, req.param, req, res);
});

//FAQ’s which are solved or unsolved
router.get("/filterstatus/:status", async (req, res) => {
	return sendResponse.executeMethod(faqController.filterstatus, req.param, req, res);
});

//count of FAQ's
router.get("/countfaq", async (req, res) => {
	return sendResponse.executeMethod(faqController.countfaq, req.param, req, res);
});


module.exports = router;