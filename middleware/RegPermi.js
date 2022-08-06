module.exports = function (req, res, next) {
    if(req.user.IsAdmin === true){
        next();
      }
      else if(req.user.RegistrationPermission == 1){
        next();
      }
      else{
        return res.status(403).send(" You are not admin also you have no permission of registration....");
      }
  };
  

