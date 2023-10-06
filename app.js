const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
});

// Define your blog schema and model here

const postSchema = {
  title: String,
  content: String,
};

const Post = mongoose.model("post", postSchema);

const homeStartingContent =
  "Welcome to our blog's 'Home' page, where the world of captivating stories, insightful articles, and inspiring thoughts comes to life. Explore a diverse collection of posts that cover a wide range of topics, from travel adventures to lifestyle tips, and discover the voices that make our blog a unique and engaging destination. Whether you're here for inspiration or simply to unwind with a good read, our 'Home' page is where your journey begins.";
const aboutContent =
  "Step into the world of our blog with a visit to our 'About' page. Get to know the creators and contributors behind the scenes, and uncover the passion and dedication that fuel our content. Learn about our mission, values, and what drives us to share stories, insights, and knowledge with our readers. Dive deeper into the heart of our blog and discover the people who are committed to bringing you engaging and informative content.";
const contactContent =
  "Welcome to our 'Contact' page, the gateway to connecting with us directly. We value your feedback, questions, and thoughts, and we're excited to hear from you. Whether you have a collaboration idea, a suggestion, or simply want to say hello, this is where you can reach out to our team. Your input helps us continue to improve and create content that resonates with you. You can contact us via email at contact@yourblog.com or give us a call at +1-123-456-7890. Additionally, you can find us on social media platforms such as Twitter (@YourBlog), Facebook (YourBlogPage), and Instagram (@YourBlogOfficial) where we share the latest updates, behind-the-scenes moments, and more. We look forward to hearing from you and building a stronger community together";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  Post.find({}).then((posts) => {
    res.render("home", {
      homeStartingContent: homeStartingContent,
      posts: posts,
    });
  });
});
app.get("/about", function (req, res) {
  res.render("about", {
    aboutStartingContent: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact", {
    contactStartingContent: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  post
    .save()
    .then(() => {
      console.log("Successfully saved");
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/");
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;
  Post.findOne({ _id: requestedPostId })
    .then((post) => {
      res.render("post", {
        title: post.title,
        content: post.content,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
const PORT = process.env.PORT;
app.listen(PORT || 3000, function () {
  console.log("Server started on port " + PORT);
});
