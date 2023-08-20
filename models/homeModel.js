const mongoose = require("mongoose")

const HomeSchema = {
    title: String,
    content: String,
};

const Home = mongoose.model("Home", HomeSchema);

module.exports = Home;
