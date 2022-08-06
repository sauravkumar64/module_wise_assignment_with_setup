const express = require("express");
const router = express.Router();
const controller = require("../controller");
const IsAdmin= require("../middleware/IsAdmin.js")
const IsAuth= require("../middleware/IsAuth.js")
const RegPermission= require("../middleware/RegPermi.js")
const BlockPermis= require("../middleware/BlockPermis.js")
const unblockPermis= require("../middleware/UnblockPermis.js")
const deletePermis= require("../middleware/DeletePermis.js")
const EditPermis= require("../middleware/EditPermis.js")
const sendResponse = require("../helper/sendResponse");


//1. Registration for Admin only
router.post("/AdminRegistration", (req, res) => {
	return sendResponse.executeMethod( controller.AdminRegister.Registration, req.body, req, res);
});

//2. Registration  for Sub-Admin by admin and sub-admin if they have a permission API
router.post("/registration",IsAuth,RegPermission, (req, res) => {
	return sendResponse.executeMethod( controller.AdminRegister.Registration, req.body, req, res);
});


//3. login admin and sub-admin
router.post("/login", (req, res) => {
	return sendResponse.executeMethod( controller.AdminRegister.loginAdmin, req.body,req,res);
});
//4. List all the admins that are blocked or not blocked, but not deleted, alongwith count of users. And also we can filter admins by their name, if admin wants to see only blocked admins then apply blocked filter, and if admin want to see only non blocked admins then apply that filter.
router.get("/list",IsAuth,(req, res) => {
	let payload = req.query;
	if ((payload.skip) && (payload.limit) && (payload.skip > 0)) {
		payload.skip = (payload.skip - 1) * payload.limit;
	}
	return sendResponse.executeMethod(controller.AdminRegister.getAllAdmins, payload, req, res);
});


//5. Admin can block the user
router.put("/block",IsAuth, BlockPermis, (req, res) => {
	return sendResponse.executeMethod( controller.AdminRegister.block ,req.body,req,res);
});

//6. Admin unblock the user
router.put("/unblock",IsAuth, unblockPermis, (req, res) => {
	return sendResponse.executeMethod( controller.AdminRegister.unblock ,req.body,req,es);
});


//7. admin edit the details
router.put("/edit",IsAuth, EditPermis, (req, res) => {
	return sendResponse.executeMethod( controller.AdminRegister.edit ,req.body,req,res);
});


//Delete user
router.delete("/delete",IsAuth, deletePermis, (req, res) => {
	return sendResponse.executeMethod( controller.AdminRegister.deleteperson ,req.body,req,res);
});






module.exports = router;
