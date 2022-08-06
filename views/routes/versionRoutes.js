var express = require("express");
var router = express.Router();
let Controllers = require("../controllers");

router.get("/getappdetails", async (req, res) => {
  let data = await Controllers.versionControllers.getAppDetails(req.query);
  if (data) {
    res.json({ status: 200, message: "getAllAppDetails", data });
  } else {
    res.json({ status: 400, message: "Something Wrong!!" });
  }
});

router.post("/", async (req, res) => {
  let data = await Controllers.versionControllers.addAppDetails(req.body);

  if (data) {
    res.json({ status: 200, message: "App Version data added successfully." ,data});
  } else {
    res.json({ status: 400, message: "Something Wrong!!" });
  }
});

router.get("filter/:platform", async (req, res, next) => {
  let data = await Controllers.versionControllers.getPlatform(req.params);
  console.log(data);
  if (data) res.json({ status: 200, data: data });
  else {
    res.json({ status: 400, message: "Something Wrong!!" });
  }
});

router.get("filter/:appname", async (req, res, next) => {
  let data = await Controllers.versionControllers.getAppDetail(req.params);
  console.log(data);
  if (data) res.json({ status: 200, data: data });
  else {
    res.json({ status: 400, message: "Something Wrong!!" });
  }
});

router.get("/count-app-versions/:appname/:platform", async (req, res, next) => {
  let data = await Controllers.versionControllers.countAppVersion(req.params);
  console.log(data);
  if (data) res.json({ status: 200, data: data });
  else {
    res.json({ status: 400, message: "Something Wrong!!" });
  }
});

router.get("/app-version-details/:appname", async (req, res, next) => {
let data = await Controllers.versionControllers.appVersionDetails(req.params);
  console.log(data);
  if (data) res.json({ status: 200, data: data });
  else {
    res.json({ status: 400, message: "Something Wrong!!" });
  }
});

router.delete("/:id", async (req, res, next) => {
  let data = await Controllers.versionControllers.deleteAppVersion(req.params);
  if (data) res.json({ status: 200, data: "App version Deleted Successfully" });
  else {
    res.json({ status: 400, message: "Something Wrong!!" });
  }
});

router.put("/edit", async (req, res, next) => {
  let data = await Controllers.versionControllers.editDetails(req.body);
  if (data) res.json({ status: 200, message: "Updated Successfully" });
  else {
    res.json({ status: 400, message: "Something Wrong!!" });
  }
});

module.exports = router;
