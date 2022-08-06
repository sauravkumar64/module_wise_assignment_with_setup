const Model = require("../model");
const Service = require("../service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Helper = require("../helper/validator.js");
const Joi = require("joi");
let adminProjection = ["adminId", "name", "email", "title", "Isblocked", "createdAt"];
module.exports = {
  Registration: async (datas) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      title: Joi.string(),
      IsAdmin: Joi.number().integer(),
      RegistrationPermission: Joi.number().integer(),
      BlockedPermission : Joi.number().integer(),
      UnblockedPermission : Joi.number().integer(),
      DeletedPermission : Joi.number().integer() ,
      EditPermission: Joi.number().integer()
    });
    let data = await Helper.verifyjoiSchema(datas, schema);
    if (!data) {
      return { status: "failed", message: "Invalid strings types" };
    } else {
      let adminData = {
        name: data.name,
        title: data.title,
        IsAdmin:data.IsAdmin,
        email: data.email,
        password: data.password,
        RegistrationPermission:data.RegistrationPermission,
        BlockedPermission: data.BlockedPermission,
        UnblockedPermission:data.UnblockedPermission,
        DeletedPermission:data.DeletedPermission,
        EditPermission:data.EditPermission
      };
      const admin = await Service.AdminService.getAdmin(adminData);

      if (admin) {
        return { status: "failed", message: "Email already exist" };
      } else {
        if (data.email && data.password) {
          try {
            var value = data.password;
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(value, salt);
            let admindata = {
              name: data.name,
              title: data.title,
              IsAdmin:data.IsAdmin,
              email: data.email,
              password: hashPassword,
              RegistrationPermission:data.RegistrationPermission,
              BlockedPermission: data.BlockedPermission,
              UnblockedPermission:data.UnblockedPermission,
              DeletedPermission:data.DeletedPermission,
              EditPermission:data.EditPermission,
            };
            let admin = await Service.AdminService.addAdmin(admindata);
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
      adminId: data.adminId,
    };
    let users = await Service.AdminService.get(datas);
    if(users){
      let user = await Service.AdminService.deleteperson(datas);
      return {
        status: "Success",
        message: "Sucessfull delete the user",
        user: user,
      };
    }
    return {
      status: "falied",
      message: "User not register",
      user: user,
    };
   
  },
  block: async (d) => {
    let data = {
      adminId: d.adminId,
    };
    let user = await Service.AdminService.get(data);
    if (user) {
      let user = await Service.AdminService.blockperson(data);
      return {
        status: "Success",
        message: "Sucessfull block the user",
      };
    }

    return {
      status: "Failed",
      message: "Not able to blocked the user",
    };
  },
  unblock: async (d) => {
    let data = {
      adminId: d.adminId,
    };
    let user = await Service.AdminService.get(data);
    if (user) {
      let user = await Service.AdminService.unblockperson(data);
      return {
        status: "Success",
        message: "Sucessfull unblock the user",
      };
    }

    return {
      status: "Failed",
      message: "Not able to unblocked the user",
    };
  },
  loginAdmin: async (datas) => {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
      });
      let data = await Helper.verifyjoiSchema(datas, schema);
      if(!data){
        return { status: "failed", message: "Invalid strings types" };
      }
      const admindata = {
        email: data.email,
        password: data.password,
      };
      const user = await Service.AdminService.getAdmin(admindata);
      if (user.Isblocked === 1) {
        return { status: 404, message: "You are blocked " };
      }
      if (data.email && data.password) {
        const useremail = await Service.AdminService.getAdmin(admindata);

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
                IsAdmin: useremail.IsAdmin,
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

            return {
              status: "Success",
              message: "Login success",
              token: token,
              adminId:useremail.adminId
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
  edit: async (d) => {
    let data = {
      adminId: d.adminId,
      RegistrationPermission: d.RegistrationPermission,
      BlockedPermission:d.BlockedPermission,
      UnblockedPermission:d.UnblockedPermission,
      DeletedPermission:d.DeletedPermission,
      EditPermission:d.EditPermission,
  
    };
    let user = await Service.AdminService.get(data);
    if (user) {
      let user = await Service.AdminService.edit(data);
      return {
        status: "Success",
        message: "Sucessfull edit the user",
      };
    }

    return {
      status: "Failed",
      message: "Not able to edit the user because user not register",
    };
  },
	getAllAdmins: async(payloadData) => {
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
		let admins = await Service.AdminService.getAllAdmins(payload, adminProjection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
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
 