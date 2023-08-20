const mongoose = require("mongoose")

const PostSchema = {
    title: String,
    content: String,
};

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
