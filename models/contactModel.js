const mongoose = require("mongoose")

const ContactSchema = {
    title: String,
    content: String,
};

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
