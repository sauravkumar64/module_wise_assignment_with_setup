const Joi = require("joi");
const Response = require("../config/response");
let commonHelper = require("../Helper/comman");
let config = require("../config/env")();
let message = require("../config/messages");
const Services = require("../services");


module.exports = {

/* This is a function that is used to add notification. */
  addNotification: async (datas) => {
    
      const schema = Joi.object({
        platform: Joi.string().valid("Android", "IOS"),
        notification:  Joi.string().min(3).max(30).required(),
        userId: Joi.number().precision(2).required(),
      });

      let data = await commonHelper.verifyjoiSchema(datas, schema);
      
    
      if (!data) {
        console.log("-------------------------------invalid data");
        throw Response.error_msg.InvalidData;
        
      } else {
        let criteria = {
          userId: userId,
        };
      }
    
    
        let findData = await Services.NotificationService.add(data);
        try {
          if (findData) {
            res.status(200).json({ msg: "New Notification added" });
          }
        }
          catch (err) {
            console.log("-----", err);
        throw Response.error_msg.implementationError;
              };
    },
  
  /* This is a function that is used to find the blocked user. */
   Blocked: async (data) => {
    let user = await Services.NotificationService.findblocked();
    return user;
  },
  
  /* This is a function that is used to find the user by platform. */
  filter: async (d) => {
    let id={
      id:d.id,
    }
    if (id === "Android") {
      let user = await Services.NotificationService.findIOS();
      return user;
    } else if(id==="IOS"){
      let user = await Services.NotificationService.findAndroid();
      return user;
    }
  },
  viewAll: async () => {
    let user = await Services.NotificationService.view();
    return user;
  },
  viewperson: async (data) => {
    const datas = {
      notificationId: data.notificationId,
    };
    let user = await Services.NotificationService.viewperson(datas);
    if (user) {
      return user;
    } else {
      return { status: "failed", message: "No user present" };
    }
  },
  edit: async (data) => {
    const datas = {
      notificationId: data.notificationId,
      notification:data.notification,
      platform: data.platform
    }; 
    console.log(datas)
    let user = await Services.NotificationService.viewperson(datas);
    if (user) {
      let user = await Services.NotificationService.edit(datas);
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
  deleteperson: async (data) => {
    const datas = {
      notificationId: data.notificationId,
    };
    let users = await Services.NotificationService.viewperson(datas);
    if(users){
      let user = await Services.NotificationService.deleteperson(datas);
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
   
  }
};