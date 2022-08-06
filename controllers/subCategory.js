const Services = require("../services");
const multer = require("multer");
const path = require("path");
const response = require("../config/response");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Images");
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
  addSubCategory: async (datas, d, req, res) => {
    let data = {
      name: datas.name,
      image: d.path,
      parentCid: datas.parentCid,
    };
    if (req.user.role === 1) {
      const category = await Services.subCatSer.findSubCategory(data);
      if (category) {
        // return "Sub-Category already exists";
        throw response.error_msg.categoryAlreadyExists;
      } else {
        let newData = {
          name: data.name,
          parentCid: data.parentCid,
          image: data.image,
        };
        let add = await Services.subCatSer.addCategory(newData);
        return {
          status: "success",
          msg: "Sub-Category added successfully.",
          category: add,
        };
      }
    } else {
      //  return "you are not admin";
      throw response.error_msg.notAdmin;
    }
  },

  //--------  update sub category -----
  updateSubCategory: async (Data, d, req, res) => {
    const data = {
      scId: Data.scId,
      name: Data.name,
      image: d.path,
      parentCid: Data.parentCid,
    };
    const category = await Services.subCatSer.find(data);
    if (category && req.user.role === 1) {
      const newdata = {
        name: data.name,
        scId: data.scId,
        image: data.image,
        parentCid: data.parentCid,
      };
      const updateData = await Services.subCatSer.update(newdata);
      return { message: "Updation Successfull.", data: updateData };
    } else {
      //return { message: "Updation Un-successfull." };
      throw response.error_msg.updation;
    }
  },

  upload,
};
