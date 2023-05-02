const express = require("express");
const { UserModel } = require("../Model/User.model");
const {FriendsModel} = require("../Model/Friends.model");


const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt=require("bcrypt");
const { authorization } = require("../MiddleWare/Auth.middleware");

userRouter.get("/",async (req,res)=>{
   const user = await UserModel.find();
   console.log('user:', user)
   res.send(user)
})




userRouter.get("/:id/friends",authorization,async (req,res)=>{
  const user = await UserModel.find();
  let friends;
  try {
    user.map((el)=>{
      if(el.id === req.params.id){
        friends = el.friends;
      }
      
    })
    res.send(friends)
    console.log("Get Friend successful")
 } catch (error) {
   res.send({ message:"Something went wrong",error: error.message });
 }

})

userRouter.post("/:id/friends",authorization,async(req,res)=>{
   const user = await UserModel.findOne({_id:req.params.id});
   console.log('user:', user)
   try {
          let friend = new FriendsModel(req.body);
          user.friends.push(friend)
          await user.save();  

          res.status(201).send({message: "Added Friend successful" })
    
     } catch (error) {
       res.send({ message:"Something went wrong",error: error.message });
     }
   
})

userRouter.patch("/:id/friends/:friendId",async(req,res)=>{

     let userId = req.params.id;
    try{
        const query = await UserModel.findOne({_id:userId})
        console.log('query:', query);
        let temp = query.friends.map((el)=>{
          
          if(el._id == req.params.friendId){
             el.accept = true;
          }

          return el;
        });
        console.log('query.friends:', temp);

        await UserModel.findByIdAndUpdate({_id:userId},{friends:temp})
        res.send({"msg":"User has been Updated"});
    }catch(err){
        console.log(err)
        res.send({"err":"something went wrong"})
  }

})



module.exports = {
   userRouter
}