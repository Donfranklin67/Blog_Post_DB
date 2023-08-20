const mongoose = require("mongoose")

const AboutSchema = {
    title: String,
    content: String,
};

const About = mongoose.model("About", AboutSchema);

module.exports = About;
