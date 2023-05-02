const express = require("express");
const app = express();


app.use(express.json());
const bcrypt=require("bcrypt");



require('dotenv').config();
const {connection} = require("./db");

const { UserModel } = require("./Model/User.model");

const {userRouter} =require("./Routes/User.Routes")

const jwt = require("jsonwebtoken");

var cors = require('cors');
const { authorization } = require("./MiddleWare/Auth.middleware");
const { postRouter } = require("./Routes/Post.Routes");
app.use(cors())

app.get("/",(req,res)=>{
    console.log("HOME");
    res.send("WELCOME TO SOCIAL PAGE")
})



app.post("/register",async(req,res)=>{
    const {name,email,password,dob,bio,posts,friends,friendRequests} = req.body;
    try {

        bcrypt.hash(password, 5, async (err, hash)=>{
            if(err){

                console.log("err Bcrypt",err)
            }
            const user=new UserModel({
                name,
                email,
                password:hash,
                dob,
                bio,
                posts,
                friends,
                friendRequests})
            await user.save()
            res.status(200).send({message: "registration successful" })
        });
      } catch (error) {
        res.send({ message:"Something went wrong",error: error.message });
      }
    
});

app.post("/login", async (req, res) => {
    const {email,password}=req.body;
    try {
      const User = await UserModel.find({email});
      if(User.length>0){
        bcrypt.compare(password,User[0].password,(err, result)=> {
        if(err){
            console.log({error:err.message});
        }else if(result){
           const token = jwt.sign({UserId:User[0]._id},"userKey");
           res.send({message:"User has been login successfully",token:token, userDetails:User[0]});
        }else{
            res.send({message:"Wrong Credentials"});
        }
        });
      }  
    } catch (error) {
      res.send({ message:"Something went wrong",error: error.message });  
    }
  });


app.use("/users",userRouter);

app.use("/posts",postRouter)
app.listen(process.env.port,async()=>{
    try{
        await connection;
        console.log("Connected")
        console.log(`CONNECT SERVER TO ${process.env.port} PORT`)
    }catch(err){
        console.log("NOT Connected");
        console.log(err);
    }
    
})