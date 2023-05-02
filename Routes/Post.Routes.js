const express = require("express");
const { UserModel } = require("../Model/User.model");
const {FriendsModel} = require("../Model/Friends.model");
const { PostModel } = require("../Model/Post.model");
const jwt = require("jsonwebtoken");
const postRouter = express.Router();
const bcrypt=require("bcrypt");
const { authorization } = require("../MiddleWare/Auth.middleware");


postRouter.get("/",authorization,async (req,res)=>{
    const user = await UserModel.findOne({_id:req.body.userID})
    try {
       
        res.send(user.posts)
        console.log("Get Post successful")
     } catch (error) {
       res.send({ message:"Something went wrong",error: error.message });
     }
})
 

postRouter.post("/",authorization,async(req,res)=>{
    const user = await UserModel.findOne({_id:req.body.userID});
    console.log('user:',user)
    try {
           let post = new PostModel(req.body);
           user.posts.push(post)
           await user.save();  
           res.status(201).send({message: "Added Post successful" })
     
      } catch (error) {
        res.send({ message:"Something went wrong",error: error.message });
      }
    
})
 

postRouter.patch("/:id",authorization,async(req,res)=>{

    let userId = req.body.userID;
    console.log('userId:', userId)
    let postId = req.params.id
    console.log('postId:', postId)
   try{
       const query = await UserModel.findOne({_id:userId})
       console.log('query:', query);
       let temp = query.posts.map((el)=>{
         
         if(el._id == postId){
            el = req.body;
         }

         return el;
       });
       console.log('query.post:', temp);

       await UserModel.findByIdAndUpdate({_id:userId},{posts:temp})
       res.send({"msg":"User has been Updated"});
   }catch(err){
       console.log(err)
       res.send({"err":"something went wrong"})
 }

})


postRouter.delete("/:id",authorization,async(req,res)=>{
    let userId = req.body.userID;
    const postId=req.params.id
    console.log('postId:', postId)
    try{
        let post = await UserModel.findOne({_id:userId});

        let temp = post.posts.filter((el)=>{
            return el._id != postId;
          });
          console.log('query.post:', temp);
   
          await UserModel.findByIdAndUpdate({_id:userId},{posts:temp})
        res.send(`User with user id ${postId} has been deleted from the database`);
    }catch(err){
        console.log(err)
        res.send({"err":"something went wrong"})
    }
})


postRouter.post("/:id/likes",authorization,async(req,res)=>{
    const user = await UserModel.findOne({_id:req.body.userID});
    console.log('user:', user)
  
   try {
          let temp = new UserModel(req.body);
          user.posts.map((el)=>{
            if(el._id == req.params.id){
              console.log('el.likes:', el.likes)
              el.likes.push(temp)
              
            }
            console.log('after:', el.likes)
            return el;
            
          })

          console.log("user.posts",user.posts)
          await UserModel.findByIdAndUpdate({_id:req.body.userID},{posts:user.posts});  

          res.status(200).send({message: "click like successful" })
    
     } catch (error) {
       res.send({message:"Something went wrong",error: error.message });
     }
})

postRouter.post("/:id/comments",authorization,async(req,res)=>{
  const user = await UserModel.findOne({_id:req.body.userID});

  const {text} = req.body;
  // console.log('user:', user)

 try {
        console.log('user.posts:', user.posts)
        user.posts.map((e)=>{
          if(e._id == req.params.id){
           console.log(' e.comments.user:',  e.comments.user)
           e.comments.user = user;
           console.log('e.comments.text:', e.comments.text)
           e.comments.text = text;
          }
        })

        console.log("user.comments",user.comments)
        await UserModel.findByIdAndUpdate({_id:req.body.userID},{posts:user.posts});  

        res.status(200).send({message: "comment added successful" })
  
   } catch (error) {
     res.send({message:"Something went wrong",error: error.message });
   }
})

postRouter.get("/:id",authorization,async(req,res)=>{
  const user = await UserModel.findOne({_id:req.body.userID});
  let data;
  try{
    user.posts.map((el)=>{
      if(el._id == req.params.id){
        data = el;
      }
    })
    res.send(data)
  }catch(err){
      console.log(err)
      res.send({"err":"something went wrong"})
  }
})

module.exports = {
    postRouter
}