const jwt = require("jsonwebtoken");

const authorization=(req,res,next)=>{
const token = req.headers.authorization;
if(token){
    jwt.verify(token,"userKey",(err,decoded)=>{
        if(err){
            console.log(err);
        }else if(decoded){
            req.body.userID = decoded.UserId;
            console.log("decoded",decoded);
            next();
        }else{
          res.send({message:"You have to login first"})
        }
    })
 }else{
    res.send({message:"You have to login first"})
  }
}

module.exports={authorization};