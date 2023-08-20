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
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }).then((con) => {
  console.log("Database connected successfully!")
})
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// async function work () {
//   try {
//     const item1 = new Home({
//       title: "Home",
//       content: homeStartingContent
//     })
//     await Home.insertMany([item1])
    
    
//     const item2 = new Contact({
//       title: "Contact Us",
//       content: contactContent
//     })
//     await Contact.insertMany([item2])
    
//     const item3 = new About({
//       title: "About Us",
//       content: aboutContent
//     })
//     await About.insertMany([item3])
//     console.log("Done All")
//   } catch (e) {
//     console.log(e.message)
//   }
  
// }


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

app.get("/about", async function (req, res) {
  try {
    const aboutData = await About.findOne({title: "About Us"}).exec();
    res.render("about", { aboutContent: aboutData.content });
  } catch (e) {
    console.log(e.message)
  }
});

app.get("/contact", async function (req, res) {
  try {
    const contactData = await Contact.findOne({title: "Contact Us"}).exec();
    res.render("contact", { contactContent: contactData.content });
  } catch (e) {
    console.log(e.message)
  }
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

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

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

