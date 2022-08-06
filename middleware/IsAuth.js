const jwt= require("jsonwebtoken")

module.exports= function(req,res,next){
const token= req.header('Authorization');
if(!token){
    return res.status(401).send(" access rejected, You are not loged in....")
}try {
    const decodedToken=jwt.verify(token,process.env.JWT_SECRET_KEY)
    req.user=decodedToken;
    next();
} catch (error) {
    res.status(400).send(" wrong token ...")
}
}
