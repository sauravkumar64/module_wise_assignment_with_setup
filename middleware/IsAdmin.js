module.exports = function (req, res, next) {
    if(req.user.IsAdmin === true){
      next();
    }
  return res.status(403).send(" You are not admin ....");
  };
  


