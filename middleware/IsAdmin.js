
module.exports= function(req,res,next){
if(req.user.IsAdmin===0){
    return res.status(403).send(" You are not admin....")
}
next();
}