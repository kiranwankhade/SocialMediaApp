const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    dob: String,
    bio: String,
    posts: [],
    friends: [],
    friendRequests: []
},{
    versionKey:false
});



const UserModel = mongoose.model("user",userSchema);

module.exports = {
    UserModel
}
