const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const IsAdmin = require("../middleware/auth_admin");
const IsAuth = require("../middleware/auth");
const sendResponse= require("../Helper/sendResponse")


router.post("/addNotification", (req, res) => {
	return sendResponse.executeMethod(controller.NotificationController.addNotification, req.body, req, res);
});

/* This is a route that is used to get all the blocked notifications from the database. */
router.get("/blocked-notifications",async(req,res)=>{
  return sendResponse.executeMethod(controller.NotificationController.Blocked, req.body, req, res);

});

/* This is a route that is used to get all the filtered notifications from the database. */
router.get("/filter-notifications/:id",async(req,res)=>{
  return sendResponse.executeMethod(controller.NotificationController.filter, req.body, req, res);

});

/* This is a route that is used to get all the notifications from the database. */
router.get("/view-notifications",async(req,res)=>{
  return sendResponse.executeMethod(controller.NotificationController.viewAll, req.body, req, res);
  
})

/* This is a route that is used to get all the notifications from the database. */
router.get("/view-notifications/:Id",async(req,res)=>{
  return sendResponse.executeMethod(controller.NotificationController.viewperson, req.body, req, res);
 
})

/* This is a route that is used to edit a notification in the database. */
router.put("/edit-notification",async(req,res)=>{
  return sendResponse.executeMethod(controller.NotificationController.edit, req.body, req, res);

})

/* This is a route that is used to delete a notification in the database. */
router.delete("/delete-notification",IsAuth,async(req,res)=>{
  return sendResponse.executeMethod(controller.NotificationController.deleteperson, req.body, req, res);

})

module.exports = router;
 
