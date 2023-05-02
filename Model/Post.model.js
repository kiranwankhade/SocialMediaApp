const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    userID: String,
    text: String,
    image: String,
    createdAt: Date,
    likes: [],
    comments: [{
      user: {},
      text: String,
      createdAt: Date
    }]
},{
    versionKey:false
});

const PostModel = mongoose.model("post",postSchema);

module.exports = {
    PostModel
}
