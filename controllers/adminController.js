const _ = require("underscore");
const moment = require("moment");
const Joi = require("joi");
const appConstants = require("./../config/appConstants");
const Response = require("../config/response");
let commonHelper = require("../Helper/common");
let config = require("../config/env")();
let message = require("../config/messages");
let Services = require("../services");
const privateKey = config.APP_URLS.PRIVATE_KEY_ADMIN;
let TokenManager = require("../Helper/adminTokenManager");
let NotificationManager = require("../Helper/mailer");
let adminProjection = ["id", "firstName", "lastName", "email", "countryCode", "phoneNumber", "adminType", "image", "isBlocked", "createdAt"];


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "images");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 1000000 },
//   fileFilter: (req, file, cb) => {
//     const fileTypes = /jpeg|jpg|png|gif/;
//     const mimeType = fileTypes.test(file.mimetype);
//     const extname = fileTypes.test(path.extname(file.originalname));

//     if (mimeType && extname) {
//       return cb(null, true);
//     }
//     cb("Give a proper file format to upload.");
//   },
// });

module.exports = {
	getAllAdmins: async(payloadData) => {
		const schema = Joi.object().keys({
			limit: Joi.number().required(),
			skip: Joi.number().required(),
			sortBy: Joi.string().optional(),
			orderBy: Joi.string().optional(),
			search: Joi.string().optional().allow(""),
			adminType: Joi.string().optional().allow(""),
			isBlocked: Joi.number().optional(),
			isActive: Joi.number().optional(),
			accessPermissions: Joi.string().optional(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let admins = await Services.AdminService.getAllAdmins(payload, adminProjection, parseInt(payload.limit, 10) || 10, parseInt(payload.skip, 10) || 0);
		if (admins) {
			return admins;
		} else {
			return {
				rows: [],
				count: 0,
			};
		}
	},
  addAdmin: async(payloadData) => {
		const schema = Joi.object().keys({
			email: Joi.string().optional(),
			firstName: Joi.string().optional(),
			lastName: Joi.string().optional(),
			countryCode: Joi.string().optional(),
			phoneNumber: Joi.string().optional(),
			adminType: Joi.any().valid(...appConstants.APP_CONSTANTS.ADMIN_TYPES).required(),
			accessPermissions: Joi.array().items({
				module: Joi.string().required(),
				permission: Joi.number().valid(0, 1).required(),
			}),
		});
		let generatedString = commonHelper.generateRandomString(6, "numeric");
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    console.log("ssksksksk",payload)
		let condition = {
			email: payload.email,
			isDeleted: 0,
		};
		let checkAdmin = await Services
			.AdminService
			.getAdmin(condition, ["id", "email", "emailVerified"], false);
		if (checkAdmin) throw Response.error_msg.alreadyExist;
		let objToSave = {};
		if (_.has(payload, "email") && payload.email != "") objToSave.email = payload.email;
		if (_.has(payload, "firstName") && payload.firstName != "") objToSave.firstName = payload.firstName;
		if (_.has(payload, "lastName") && payload.lastName != "") objToSave.lastName = payload.lastName;
		if (_.has(payload, "adminType") && payload.adminType != "") objToSave.adminType = payload.adminType;
		if (_.has(payload, "countryCode") && payload.countryCode != "") objToSave.countryCode = payload.countryCode;
		if (_.has(payload, "phoneNumber") && payload.phoneNumber != "") objToSave.phoneNumber = payload.phoneNumber;
		objToSave.passwordResetToken = generatedString;
		let addAdmin = await Services.AdminService.addAdmin(objToSave);
		let permissions = {};
		if (addAdmin) {
			if (payload.accessPermissions) {
				payload.accessPermissions.forEach((accessPermission) => {
					permissions[accessPermission.module] = accessPermission.permission;
				});
			}
			permissions.adminId = addAdmin.dataValues.id;
			await Services.AdminPermissionService.createAdminPermission(permissions);
			let path = "/admin/v1/admin/generatePassword?email=" + payload.email + "&token=";
			var variableDetails = {
				user_name: (payload.firstName + payload.lastName || "Admin User"),
				ip: config.APP_URLS.API_URL,
				baseUrl: config.APP_URLS.API_URL,
				s3Url: config.AWS.S3.s3Url,
				resetPasswordToken: config.APP_URLS.API_URL + path + generatedString
			};
			// await NotificationManager.sendMail("ADD_ADMIN", payload.email, variableDetails);
		} else throw Response.error_msg.implementationError;
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

  forgotPassword: async (data) => {
    
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
  login: async(payloadData) => {
		const schema = Joi.object().keys({
			email: Joi.string().email().required(),
			password: Joi.string().required(),
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
		let emailCriteria = {
			email: payload.email,
			isDeleted: 0
		};
		let projection = [...adminProjection];
		projection.push("password");
		let checkEmailExist = await Services.AdminService.getAdmin(emailCriteria, projection, true);
		if (checkEmailExist && checkEmailExist.id) {
			let comparePass = await commonHelper.comparePassword(payload.password, checkEmailExist.password);
			let tokenGenerated;
			if (checkEmailExist.isBlocked === 1) throw Response.error_msg.blockUser;
			else if (!comparePass) {
				throw Response.error_msg.passwordNotMatch;
			} else {
				let tokenData = {
					email: checkEmailExist.email,
					id: checkEmailExist.id,
					type: checkEmailExist.adminType
				};
				TokenManager
					.setToken(tokenData, privateKey, (err, output) => {
						if (err) {
							throw Response.error_msg.implementationError;
						} else {
							if (output && output.accessToken) {
								tokenGenerated = output.accessToken;
							} else {
								throw Response.error_msg.implementationError;
							}
						}
					});
				delete checkEmailExist.dataValues["password"];
				let response = {
					accessToken: tokenGenerated,
					adminDetails: checkEmailExist
				};
				return response;
			}
		} else throw Response.error_msg.emailNotFound;
	},
  resetNewPassword: async(payloadData) => {
		const schema = Joi.object().keys({
			email: Joi.string().optional(),
			token: Joi.string().optional().required(),
			newPassword: Joi.string().min(5).required()
		});
		let payload = await commonHelper.verifyJoiSchema(payloadData, schema);
    console.log("dddd",payload)
		let adminObj = null;
		let criteria = {
			isDeleted: 0,
			passwordResetToken: payload.token
		};
		let admin = await Services.AdminService.getAdmin(criteria, ["id", "email", "firstName", "password"], false);
		if (admin) {
			adminObj = admin.dataValues;
			if (adminObj && adminObj.id) {
				let criteria = {
					id: adminObj.id
				};
				let objToSave = {
					password: await commonHelper.generateNewPassword(payload.newPassword),
					forgotPasswordGeneratedAt: null,
					passwordResetToken: null
				};
				let update = await Services.AdminService.updateAdmins(criteria, objToSave);
				if (update) {
					return {};
				} else throw Response.error_msg.implementationError;
			} else {
				throw Response.error_msg.implementationError;
			}
		} else {
			throw Response.error_msg.InvalidPasswordToken;
		}
	},
  logout: async(token) => {
		await TokenManager.expireToken(token, (err, output) => {
			if (err) {
				console.log("err ==>>", err);
				throw Response.error_msg.implementationError;
			} else {
				return output;
			}
		});
	},


};

  