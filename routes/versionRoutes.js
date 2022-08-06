var express = require("express");
var router = express.Router();
let Controllers = require("../controllers");
const sendResponse = require("../Helper/sendResponse");

router.post("/addappdetails", (req, res) => {
 	return sendResponse.executeMethod(Controllers.versionControllers.addAppDetails, req.body, req, res);
});

router.get("/getappdetails", (req, res) => {
	let payload = req.query;
  return sendResponse.executeMethod(Controllers.versionControllers.getAppDetails, payload, req, res);
});


router.delete("/:id", (req, res) => {
	let payload = req.params;
	return sendResponse.executeMethod(Controllers.versionControllers.deleteAppVersion, payload, req, res);
});


router.put("/edit", async (req, res) => {
  let payload = req.body;
	return sendResponse.executeMethod(Controllers.versionControllers.editDetails, payload, req, res);
});



router.get("/getplatform-details/:platform", (req, res) => {
	let payload = req.params;
  return sendResponse.executeMethod(Controllers.versionControllers.getPlatform, payload, req, res);
});



router.get("/count-app-versions/:appname/:platform", (req, res) => {
	let payload = req.params;
  return sendResponse.executeMethod(Controllers.versionControllers.countAppVersion, payload, req, res);
});

router.get("/app-version-details/:appname", (req, res) => {
	let payload = req.params;
  return sendResponse.executeMethod(Controllers.versionControllers.appVersionDetails, payload, req, res);
});



module.exports = router;
