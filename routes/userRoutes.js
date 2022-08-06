const express = require("express");
const router = express.Router();
const controller = require("../controller");
const sendResponse = require("../helper/sendResponse");
// const IsAuth = require('../middleware/IsAdmin')

router.post("/AdminRegistration", (req, res) => {
	return sendResponse.executeMethod(controller.userRegister.Registration, req.body, req, res);
});

router.get("/view",(req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(controller.userRegister.detailUser, payload, req, res);
});

router.delete("/delete",async(req,res)=>{
  return sendResponse.executeMethod(controller.userRegister.deleteperson,req.body,req,res);
})

router.put("/block",async(req,res)=>{
  return sendResponse.executeMethod(controller.userRegister.block,req.body,req,res)
})

router.put("/unblock",(req,res)=>{
  return sendResponse.executeMethod(controller.userRegister.unblock,req.body,req,res)
})

module.exports = router;
