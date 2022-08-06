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

router.get("/getallfaq", authentication, (req, res) => {
	return sendResponse.executeMethod(faqController.getAllfaq, req.params, req, res);
});


module.exports = router;