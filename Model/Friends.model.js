const mongoose = require("mongoose");

const friendSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dob: String,
    bio: String,
    posts: [],
    friends: [],
    friendRequests: [],
    accept:{type:Boolean,default:false},
    userID:String
},{
    versionKey:false
});



const FriendsModel = mongoose.model("friend",friendSchema);

module.exports = {
    FriendsModel
}