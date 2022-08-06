const Services = require("../services");
const Helper = require("../Helper/comman");
const Joi = require("joi");

require("dotenv").config();

module.exports = {
  getAppDetails: async (data) => {
    let criteria = {};
    let projection = [
      "appname",
      "version",
      "platform",
      "minimumVersion",
      "latestVersion",
    ];
    let appDetails = await Services.versionServices.getAppDetails(
      criteria,
      projection
    );
    console.log("getUserfucntion", appDetails);
    return appDetails;
  },

  addAppDetails: async (data) => {
    try {
      const schema = Joi.object({
        appname: Joi.string().required(),
        // version: Joi.string()
        //   .regex(/([1-9][.])([0-9][.])[0-9]/)
        //   .required(),
        version:Joi.number().precision(2).required(),
        platform: Joi.string().valid("Android", "IOS"),
      });

      let validData = await Helper.verifyjoiSchema(data, schema);
      const { appname, version, platform } = validData;
     
      if (!validData) {
        console.log("invalid data");
      } else {
        let criteria = {
          appname: appname,
         
        };
       
        let checkversiondata = await Services.versionServices.checkVersion(criteria);
      if (checkversiondata == null) {
        dataToSave = {
          appname: appname,
          version: version,
          platform: platform,
          minimumVersion: version,
          latestVersion: version,
        };
        appdata = await Services.versionServices.addAppDetails(dataToSave);
        return appdata;
      }
      else if (checkversiondata.appname===appname && checkversiondata.platform===platform && checkversiondata.version===version) {
         console.log("version data is already in the database");
         }
        else if (checkversiondata.appname===appname && checkversiondata.platform===platform) 
        {
          if (checkversiondata.version > version) {
            console.log("Please Enter greater version");
          } else if (checkversiondata.version === version) {
            console.log(" version is equal");
          } else {
            dataToSave = {
              appname: appname,
              version: version,
              platform: platform,
              minimumVersion: checkversiondata.minimumVersion,
              latestVersion: version,
            };
            appdata = await Services.versionServices.addAppDetails(dataToSave);
            return appdata;
          }
        }
        else {
          dataToSave = {
            appname: appname,
            version: version,
            platform: platform,
            minimumVersion: checkversiondata.minimumVersion,
            latestVersion: version,
          };
          appdata = await Services.versionServices.addAppDetails(dataToSave);
          return appdata;
        }
      }
    } catch (err) {
      console.log("-----", err);
    }
  },

  getPlatform: async (data) => {
    let criteria = { platform: data.platform };
    let projection = ["id", "appname", "platform"];
    let PlatformData = await Services.versionServices.getPlatform(
      criteria,
      projection
    );
    return PlatformData;
  },
  getAppDetail: async (data) => {
    let criteria = { appname: data.appname };
    let projection = ["id", "appname", "platform", "version"];
    let PlatformData = await Services.versionServices.getAppDetail(
      criteria,
      projection
    );
    return PlatformData;
  },

  countAppVersion: async (data) => {
    let criteria = { appname: data.appname , platform: data.platform};
    let projection = ["appname", "platform","version"];
    let countAppVersionDetails = await Services.versionServices.countAppVersion(
      criteria,
      projection
    );
    return countAppVersionDetails;
  },
  appVersionDetails: async (data) => {
    let criteria = { appname: data.appname };
    console.log(criteria);
    let projection = ["appname", "platform", "version"];
    let versionData = await Services.versionServices.appVersionDetails(
      criteria,
      projection
    );
    return versionData;
  },
  deleteAppVersion: async (data) => {
    let criteria = {
      id: data.id,
    };
    console.log(criteria);
    objectToSave = {
      isdeleted: true,
    };
    let updateWith = await Services.versionServices.updateIsDeleted(
      criteria,
      objectToSave
    );
    console.log(updateWith);
    let DeletedData = await Services.versionServices.deleteAppVersion(criteria);
    return DeletedData;
  },
  editDetails: async (data) => {
    let dataToUpdate = {};
    if (data && data.appname) dataToUpdate.appname = data.appname;
    if (data && data.platform) dataToUpdate.platform = data.platform;
    if (data && data.version) dataToUpdate.version = data.version;
    let criteria = {
      id: data.id,
    };
    let saveEditDeatils = await Services.versionServices.editDetails(
      criteria,
      dataToUpdate
    );
    console.log(saveEditDeatils);
    return saveEditDeatils;
  },
};
