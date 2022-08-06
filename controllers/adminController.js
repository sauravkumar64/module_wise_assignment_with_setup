const Admin = require("../models/admin");
const Services = require("../services");
const Helper = require("../Helper/common");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const req = require("express/lib/request");
const { object } = require("joi");
const services = require("../services");
const emailsender = require("../mail");
const multer = require("multer");
const Response = require("../config/response");
let message = require("../config/messages");
const path =require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give a proper file format to upload.");
  },
});

module.exports = {
  getAlladmin: async (req,res,data) => {
    const { adminID, iat, exp } = req.user;
    let criteria = { id: adminID };
   
    let projection = ["name","email","profilepic"];
    let Admin = await Services.adminService.getadmin(
      criteria,
      projection,
      data.limit || 10,
      data.skip || 0
    );
    return Admin
  },
  addAdmin: async (req,data) => {
    try {
      const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
        
      });
      let payload = await Helper.verifyjoiSchema(data, schema);
     
      const datas ={name:payload.name,
        email:payload.email,
        password:payload.password,
        profilepic:req.file.path
        
      }
      if (!datas) {
        throw Response.error_msg.recordNotFound;
      } else {
        let admin = await Services.adminService.addadmin(datas);

        const token = jwt.sign(
          { adminID: admin.id },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "2d" }
        );
        Object.assign(admin, { token: token });

        return message.success.ADDED
      }
    } catch (error) {
      throw Response.error_msg.implementationError;
    }
  },
  checkAdmin: async (data) => {
    const { email, password } = data;
    let criteria = { email: email };
    let projection = ["email", "password"];

    let Admin = await Services.adminService.checkAdmin(criteria, projection);
    if (Admin === null) {
      return Admin;
    } else {
      const token = jwt.sign(
        { adminID: Admin.id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "2d",
        }
      );
      Object.assign(Admin, { token: token });

      return Admin;
    }
  },

  getAdminDetail: async (data) => {
    let criteria = {};
    let projection = ["email", "password"];
    let admin = await Services.adminService.getadmin(criteria, projection);
    return admin;
  },

  changePassword: async (req, res, data) => {
    const { old_password, new_password } = data;
    const { adminID, iat, exp } = req.user;
    let criteria = { id: adminID };

    let admin = await services.adminService.checkAdmin(criteria);

    const isMatch = bcrypt.compare(old_password, admin.password);

    if (isMatch) {
      const salt = await bcrypt.genSalt(10);
      const newHashPassword = await bcrypt.hash(new_password, salt);

      const objtosave = {
        password: newHashPassword,
      };
      let admin = await Services.adminService.updatePassword(
        criteria,
        objtosave
      );
      return message.success.CHANGED
    } else {
      throw Response.error_msg.implementationError;
    }
  },

  resetPasswordmail: async (data) => {
    
    let criteria = { email: data.email };

    let admin = await services.adminService.checkAdmin(criteria);

    const { id, name, email, password, profilepic } = admin;

   
    if (admin) {
      const secret = id + process.env.JWT_SECRET_KEY;

      const token = jwt.sign({ adminID: id }, secret, { expiresIn: "2d" });
      const link = `http://localhost:8000/admin/reset/${id}/${token}`;
      await emailsender(email, link);
    } else {
      throw Response.error_msg.implementationError;
    }
  },

  resetPassword: async (req, res) => {
    const { new_password, password_confirmation } = req.body;
    const { id, token } = req.params;
    let criteria1 = { id: id };
    const admin = await services.adminService.checkAdmin(criteria1);

    try {
      const { id, name, email, password, profilepic } = admin;

      const new_secret = id + process.env.JWT_SECRET_KEY;
      jwt.verify(token, new_secret);
      console.log("my-password", password_confirmation, new_password);
      if (new_password && password_confirmation) {
        if (new_password !== password_confirmation) {
          return null;
        } else {
          const salt = await bcrypt.genSalt(10);
          const newHashPassword = await bcrypt.hash(new_password, salt);
          const objtosave = {
            password: newHashPassword,
          };

          let criteria = { email: email };

          let admin = await Services.adminService.updatePassword(
            criteria,
            objtosave
          );

          return message.success.FORGOT
        }
      } else {
        return null;
      }
    } catch (error) {
      throw Response.error_msg.implementationError;
    }
  },

  editDetails: async (req,res,data) => {
    let dataToUpdate = {};
    
    const { adminID, iat, exp } = req.user;
    if (data && data.name) dataToUpdate.name = data.name;
    if (data && data.profilepic) dataToUpdate.profilepic = data.profilepic;
   
    let criteria = {
      id: adminID,
    };
    let saveEditDeatils = await Services.adminService.editDetails(
      criteria,
      dataToUpdate
    );
    return message.success.CHANGED
  },
  login: async (datas) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });
      let data = await Helper.verifyjoiSchema(datas, schema);
     
      if(!data){
        throw Response.error_msg.InvalidPasswordToken;
      }
      const admindata = {
        email: data.email,
        password: data.password,
      };
      const user = await Services.adminService.getadmin(admindata);
      if (user.Isblocked === 1) {
        return { status: 404, message: "You are blocked " };
      }
      if (data.email && data.password) {
        const useremail = await Services.adminService.getadmin(admindata);

        if (useremail != null) {
          const isMatch = await bcrypt.compare(
            data.password,
            useremail.password
          );
          if (useremail.email && isMatch) {
            //Genterate token
            const token = jwt.sign(
              {
                adminId: useremail.adminId,
                title:useremail.title,
                RegistrationPermission: useremail.RegistrationPermission,
                BlockedPermission: useremail.BlockedPermission,
                UnblockedPermission: useremail.UnblockedPermission,
                DeletedPermission: useremail.DeletedPermission,
                EditPermission:useremail.EditPermission
              },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "15m",
              }
            );
            
            return message.success.LOGIN
          } else {
            throw Response.error_msg.invalidAccess;
          }
        } else {
          throw Response.error_msg.alreadyExist;
        }
      } else {
        throw Response.error_msg.implementationError;;
      }
    } catch (error) {
      throw Response.error_msg.implementationError;
    }
    
  },

  upload
};

  