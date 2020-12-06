//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent = "Share something with us"; 

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let port = process.env.PORT
if(port == null || port == ""){
  port = 3000;
}

mongoose.connect(`mongodb+srv://Willma:madnessofmadakia@cluster0.3m9rt.mongodb.net/BlogDB`, {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({},function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});


app.get("/posts/:id", function(req, res){
  Post.find({},function(err, posts){
    posts.forEach(function(post){
      if(post._id == req.params.id){
        res.render("post", {title: post.title, content: post.content})
      }
    })
  })
});


app.listen(port, function() {
  console.log("Server started on port 3000");
});
