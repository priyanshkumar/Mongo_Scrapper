var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

var app = express();
var PORT = process.env.PORT || 3000;

var db = require("./models");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoscrapper";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

mongoose.set("useFindAndModify", false);

app.get("/scrape", function(req, res) {
  axios.get("https://www.nytimes.com/section/sports").then(function(response) {
    var $ = cheerio.load(response.data);

    $("div.css-10wtrbd").each(function(i, element) {
      var results = {};

      results.title = $(element)
        .children("h2")
        .children("a")
        .text();
      results.link =
        "https://www.nytimes.com" +
        $(element)
          .children("h2")
          .children("a")
          .attr("href");
      results.summary = $(element)
        .children("p")
        .text();
      results.author = $(element)
        .children()
        .last()
        .children(".css-9voj2j")
        .children("span")
        .text();

      mongoose.connection.db.dropDatabase();

      db.Article.create(results)
        .then(function() {
          res.redirect("/");
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  });
});

app.get("/", function(req, res) {
  db.Article.find()
    .then(function(dbArticle) {
      // View the added result in the console
      var data = {
        result: dbArticle
      };
      res.render("index", data);
    })
    .catch(function(err) {
      // If an error occurred, log it
      console.log(err);
    });
});

app.get("/api/save/:id", function(req, res) {
  db.Article.findOne({
    _id: req.params.id
  })
    .then(function(result) {
      var saveResult = {
        title: result.title,
        link: result.link,
        summary: result.summary,
        author: result.author
      };
      db.Save.create(saveResult)
        .then(() => {
          db.Article.findOneAndRemove(req.params.id)
            .then(function() {
              res.redirect("/");
            })
            .catch(function(err) {
              console.log(err);
            });
        })
        .catch(function(err) {
          console.log(err);
        });
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get("/api/saved/delete/:id", function(req, res) {
  db.Save.findOneAndRemove(req.params.id)
    .then(function() {
      res.redirect("/saved/article");
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get("/saved/article", function(req, res) {
  db.Save.find()
    .populate("notes")
    .then(function(response) {
      var data = {
        result: response
      };
      res.render("saveArticle", data);
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.post("/api/saved/note/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(response) {
      return db.Save.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { notes: response._id } },
        { new: true }
      )
        .then(function() {
          res.redirect("/saved/article");
        })
        .catch(function(err) {
          console.log(err);
        });
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.get("/api/saved/note/delete/:id", function(req, res) {
  db.Note.findOneAndRemove({ _id: req.params.id })
    .then(function() {
      res.redirect("/saved/article");
    })
    .catch(function(err) {
      console.log(err);
    });
});

app.listen(PORT, function() {
  console.log(`server up and running on ${PORT}`);
});
