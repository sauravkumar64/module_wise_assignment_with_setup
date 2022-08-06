const Services = require("../services");
const Joi = require("joi");
const Helper = require("../Helper/validation.js");
let response = require("../config/response");

module.exports = {
  addCategory: async (datas, r, req, res) => {
    const schema = Joi.object({
      name: Joi.string().required(),
    });
    let data = await Helper.verifyjoiSchema(datas, schema);
    if (!data) {
      return { status: "failed", message: "Invalid strings types" };
    } else {
      let categoryData = {
        name: data.name,
      };
      console.log(req.user);
      if (req.user.role === 1) {
        const category = await Services.categorySer.findCategory(categoryData);
        if (category) {
          // return " category already exists";
          throw response.error_msg.categoryAlreadyExists;
        } else {
          let newData = {
            name: categoryData.name,
          };
          let add = await Services.categorySer.addCategory(newData);
          return {
            status: "success",
            msg: "Category added successfully.",
            category: add,
          };
        }
      }
    }
  },

  deleteCategory: async (data, r, req, res) => {
    const obj = {
      scId: data.scId,
      parentCid: data.parentCid,
    };
    const category = await Services.categorySer.findSubCategory(obj);
    console.log("category: ", category);
    if (category && req.user.role == 1) {
      const deleteCat = await Services.categorySer.deleteCategory(obj);
      return { message: "Deletion successfull", details: deleteCat };
    } else {
      // return "Category not found, Access Denied Or You Are Not Autherized to delete.";
      throw response.error_msg.categoryNotExists;
    }
  },

  Filter: async (req, res) => {
    let data = {
      name: req.name,
    };
    if (data.name) {
      const category = await Services.categorySer.getFilteredCategories(data);
      if (category) {
        return category;
      } else {
        //  return "No data found.";
        throw response.error_msg.categoryNotExists;
      }
    } else if (!data.name) {
      const category = await Services.categorySer.findAllCategories();
      // return category.subcategories ? category.subcategories : category;
      return category;
    }
  },

  //--------  update category -----
  updateCategory: async (datas, d, req, res) => {
    const data = {
      cId: datas.cId,
      name: datas.name,
    };
    const category = await Services.categorySer.find(data);
    if (category && req.user.role === 1) {
      const newdata = {
        name: data.name,
        cId: data.cId,
      };
      const updateData = await Services.categorySer.update(newdata);
      return { message: "Updation Successfull.", data: updateData };
    } else {
      // return { message: "Updation Un-successfull." };
      throw response.error_msg.updation;
    }
  },
};
