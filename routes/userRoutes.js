const express = require("express");
const router = express.Router();
const controller = require("../controller");
const IsAdmin= require("../middleware/IsAdmin.js")
const IsAuth= require("../middleware/IsAuth.js")
//Registration Admin API
// router.use("/registration", [IsAuth, IsAdmin]);
router.post("/AdminRegistration",async (req, res) => {
  let admin = await controller.userRegister.Registration(req.body);
  res.json(admin);
});

//Blocked not-blocked and not deleted user detail
router.get("/blocked",async(req,res)=>{
  let user= await controller.userRegister.Blocked();
  res.json(user)
})

//filter on the based on blocked or not_blocked (blocked=1 and not_blocked=0)
router.get("/filter/:id",async(req,res)=>{
  let user= await controller.userRegister.filter(req,res);
  res.json(user)
})

//View all admin details

router.get("/view",async(req,res)=>{
  let user= await controller.userRegister.viewAll();
  res.json(user)
})
//view specific preson
router.get("/view/:name",async(req,res)=>{
  let user= await controller.userRegister.viewperson(req.params);
  res.json(user)
})

//Delete user
router.delete("/delete",async(req,res)=>{
  let user= await controller.userRegister.deleteperson(req.body);
  res.json(user)
})

//Admin can block the user

router.put("/block",async(req,res)=>{
  let user= await controller.userRegister.block(req.body)
  res.json(user)
})

//Admin unblock the user
router.put("/unblock",async(req,res)=>{
  let user= await controller.userRegister.unblock(req.body)
  res.json(user)
})

//login admins
router.post("/login",async(req,res)=>{
  let user= await controller.userRegister.loginAdmin(req.body)
  res.json(user);
})
module.exports = router;
