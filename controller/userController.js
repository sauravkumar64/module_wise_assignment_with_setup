const Model = require("../model");
const Service = require("../service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const transporter = require("../config/emailConfig");
const nodemailer = require("nodemailer");
const Helper= require("../helper/validator.js")
const Joi= require("joi")
let message = require("../config/messages");
const Response = require("../config/response");
let adminProjection = ["adminId", "name", "email", "title", "Isblocked", "createdAt"];
module.exports = {
  Registration: async (datas) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });
let data = await Helper.verifyjoiSchema(datas, schema);
if(!data){
  return { status: "failed", message: "Invalid strings types" };
}
else{ 
    let adminData = {
      name: data.name,
      email: data.email,
      password: data.password,
    };
    const admin = await Service.userService.getAdmin(adminData);

    if (admin) 
    throw Response.error_msg.alreadyExist

     else {
      if (data.email && data.password) {
        try {
          var value = data.password;
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(value, salt);
          let admindata = {
            name: data.name,
            title:data.title,
            email: data.email,
            password: hashPassword,
          };
          let admin = await Service.userService.addAdmin(admindata);
          //Dynamic message send on mail
          let info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: data.email,
            subject: "Registration successfull",
            html: `<p>Hi <b>${data.name}</b>, Thank you for registering with <b>Applify</b></p>`,
          });
          return {
            status: "Success",
            message: "Registeration successfull",
          };
        } catch (error) {
          return { status: "failed", message: "Unable to register" };
        }
      } else {
        return { status: "failed", message: "All fields are required" };
      }
    }
  }
  },
  deleteperson: async (data) => {
    const datas = {
      name: data.name,
    };
    let user = await Service.userService.deleteperson(datas);
    return message.success.DELETED
  },
  block: async (d) => {
    let data = {
      name: d.name,
    };
    let user = await Service.userService.get(data);
    if(user)
    {
      let user = await Service.userService.blockperson(data);
    
    return message.success.BLOCKED
  }
  return Response.error_msg.blockFailed
  },
  unblock: async (d) => {
    let data = {
      name: d.name,
    };
    let user = await Service.userService.get(data);
    if(user)
    {
      let user = await Service.userService.unblockperson(data);
    
    return message.success.UNBLOCKED
  }
   
  return Response.error_msg.unblockFailed
  },
  loginAdmin: async (data)=>{
    try {
      const admindata = {
        email: data.email,
        password: data.password,
      };
      if (data.email && data.password) {
        const useremail= await Service.userService.getAdmin(admindata)

        if (useremail != null) {
          const isMatch = await bcrypt.compare(
            data.password,
            useremail.password
          );
          if (useremail.email && isMatch) {
            //Genterate token
            const token = jwt.sign(
              { adminId: useremail.adminId },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "5d",
              }
            );
            /* const login= await Service.AdminService.updatelogin(admindata) */
           //UPDATE LOGIN COLOUMN
           
            // Put token into cookie
        /*    res.cookie("token", token, { expire: new Date() + 9999 });  */
            return {
              status: "Success",
              message: "Login success",
              token: token,
            };
          } else {
            return {
              status: "failed",
              message: "Email or Password is not Valid",
            };
          }
        } else {
          return { status: "failed", message: "You are not Registered User" };
        }
      } else {
        return { status: "failed", message: "All fields are required" };
      }
    } catch (error) {
      return { status: "failed", message: "Unabale to login" };
    }
  },
  detailUser: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().required(),
			skip: Joi.number().required(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
			title: Joi.string().optional().allow(""),
			Isblocked: Joi.number().optional(),
		});
		let payload = await Helper.verifyjoiSchema(payloadData, schema);
		let admins = await Service.userService.detailUser(payload, adminProjection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		if (admins) {
			return admins;
		} else {
			return {
				rows: [],
				count: 0,
			};
		}
	}
};
