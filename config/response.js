var error_msg = {
  alreadyExist: {
    message: "This Email is already registered with us.",
    statusCode: 400,
    responseType: "",
  },
  emailAndPasswordNotFound: {
    statusCode: 400,
    message: "This email or password is invalid.",
    responseType: "",
  },
  categoryAlreadyExists: {
    statusCode: 400,
    message: "category already exists.",
    responseType: "",
  },
  categoryNotExists: {
    statusCode: 400,
    message: "category not found or access denied",
    responseType: "",
  },
  notAdmin: {
    statusCode: 400,
    message: "you are not admin.",
    responseType: "",
  },
  updation: {
    statusCode: 400,
    message: "updation un-successfull.",
    responseType: "",
  },
  userexists: {
    statusCode: 400,
    message: "user already exists.",
    responseType: "",
  },
  invalidStrings: {
    statusCode: 400,
    message: "Invalid strings types",
    responseType: "",
  },
  userNotFound: {
    statusCode: 400,
    message: "user not found",
    responseType: "",
  },
};
var sendSuccess = function (data) {
  let success_msg = {
    statusCode: 200,
    message: data.message || "Success",
    data: data.data,
  };
  return success_msg;
};
module.exports = {
  error_msg: error_msg,
  sendSuccess: sendSuccess,
};
