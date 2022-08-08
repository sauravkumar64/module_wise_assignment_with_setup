module.exports = function (req, res, next) {
    if(req.user.is_admin){
        next();
      }
      else if(req.user.allow_edit){
        next();
      }
      else{
        return res.status(403).send(" not unauthorized ");
      }
  };
  