// Required libraries
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const Post = require("./models/postModel");
const Home = require("./models/homeModel");
const Contact = require("./models/contactModel");
const About = require("./models/aboutModel");

// Paths and configs 
dotenv.config({ path: "./config.env" })
mongoose.set("strictQuery", false)
mongoose.connect(String(process.env.DATABASE), { useNewUrlParser: true, useUnifiedTopology: true }).then((con) => {
  console.log("Database connected successfully!")
})
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// This is the home route
app.get("/", async function (req, res) {
  try {
    const posts = await Post.find({}).exec();
    const content = await Home.findOne({title: "Home"}).exec();
    res.render("home", {
      startingContent: content.content,
      posts: posts
    });
  } catch (e) {
    console.log(e.message)
  }
});


// The about route
app.get("/about", async function (req, res) {
  try {
    const aboutData = await About.findOne({title: "About Us"}).exec();
    res.render("about", { aboutContent: aboutData.content });
  } catch (e) {
    console.log(e.message)
  }
});


// The contact route
app.get("/contact", async function (req, res) {
  try {
    const contactData = await Contact.findOne({title: "Contact Us"}).exec();
    res.render("contact", { contactContent: contactData.content });
  } catch (e) {
    console.log(e.message)
  }
});


// The compose route. This route is hidden( i.e, It can't be automatically accessed from my blog site). Type http://localhost:3000/compose to access this route.
app.get("/compose", function (req, res) {
  res.render("compose");
});


// This route creates and sends the data to the databse.
app.post("/compose", async function (req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  try {
    const newPost = new Post(post)
    await Post.insertMany([newPost])
    console.log("New item has been sucessfully created!")
  } catch (e) {
    console.log(e.message)
  }

  res.redirect("/");

});


// This route gets triggered when you click Readmore on any particular post.
app.get("/posts/:postName", async function (req, res) {
  try {
    const requestedTitle = _.lowerCase(req.params.postName);
    const posts = await Post.find({}).exec();
  
    posts.forEach(function (post) {
      const storedTitle = _.lowerCase(post.title);
  
      if (storedTitle === requestedTitle) {
        res.render("post", {
          title: post.title,
          content: post.content
        });
      }
    });
  } catch (e) {
    console.log(e.message)
  }

});


// Listen for when my app gets requested on port 3000 or the process port.
app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});

