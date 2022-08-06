const express = require("express");
const router = express.Router();
const controller = require("../controller");
const IsAuth = require("../middleware/IsAuth.js");
const sendResponse = require("../helper/sendResponse");
const { Router } = require("express");

router.post("/feed/addFeed", (req, res) => {
  return sendResponse.executeMethod(
    controller.feedbackController.createFeed,
    req.body,
    req,
    res
  );
});

router.get("/feed/view/:id", (req, res) => {
  return sendResponse.executeMethod(
    controller.feedbackController.getParticularFeedBack,
    req.params,
    req,
    res
  );
});

router.delete("/feed/deleteFeed", (req, res) => {
  return sendResponse.executeMethod(
    controller.feedbackController.DeleteFeed,
    req.body,
    req,
    res
  );
});

router.get("/comment", (req, res) => {
  return sendResponse.executeMethod(
    controller.feedbackController.getcomment,
    req.body,
    req,
    res
  );
});

router.get("/ratings/:rating", (req, res) => {
  return sendResponse.executeMethod(
    controller.feedbackController.getratting,
    req.params,
    req,
    res
  );
});

module.exports = router;
