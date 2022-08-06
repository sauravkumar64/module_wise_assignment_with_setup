const express = require("express");
const Ctrl = require("../controllers");
const auth = require("../middleware/auth.js");
const router = express.Router();
const sendResponse = require("../Helper/sendResponse");

//user routes
router.post("/addUser", (req, res) => {
  return sendResponse.executeMethod(
    Ctrl.users.addUser,
    req.body,
    req.file,
    req,
    res
  );
});

router.post("/login", async (req, res) => {
  return sendResponse.executeMethod(
    Ctrl.users.login,
    req.body,
    req.query,
    req,
    res
  );
});

// category routes

router.get("/getCategory", (req, res) => {
  return sendResponse.executeMethod(
    Ctrl.categories.Filter,
    req.query,
    req.body,
    req,
    res
  );
});

// ----------------- add categories ---------------
router.post("/addCategory", auth, (req, res) => {
  return sendResponse.executeMethod(
    Ctrl.categories.addCategory,
    req.body,
    req.file,
    req,
    res
  );
});

router.post(
  "/addSubCategory",
  auth,
  Ctrl.subCat.upload.single("image"),
  (req, res) => {
    return sendResponse.executeMethod(
      Ctrl.subCat.addSubCategory,
      req.body,
      req.file,
      req,
      res
    );
  }
);

//----------------- Edit Categories ------------------------

router.delete("/deleteCategory", auth, (req, res) => {
  return sendResponse.executeMethod(
    Ctrl.categories.deleteCategory,
    req.body,
    req.file,
    req,
    res
  );
});

router.put("/update/category", auth, (req, res) => {
  return sendResponse.executeMethod(
    Ctrl.categories.updateCategory,
    req.body,
    req.file,
    req,
    res
  );
});

router.put(
  "/update/subCategory",
  auth,
  Ctrl.subCat.upload.single("image"),
  (req, res) => {
    return sendResponse.executeMethod(
      Ctrl.subCat.updateSubCategory,
      req.body,
      req.file,
      req,
      res
    );
  }
);

module.exports = router;
