var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

var app = express();
var PORT = 3000;

var db = require("./models");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/mongoscrapper", {
  useNewUrlParser: true
});

app.get("/scrape", function(req, res) {
  axios.get("https://www.nytimes.com/section/sports").then(function(response) {
    var $ = cheerio.load(response.data);

    $("div.css-10wtrbd").each(function(i, element) {
      var results = {};

      results.title = $(element)
        .children("h2")
        .children("a")
        .text();
      results.link = $(element)
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

      db.Article.create(results)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
  });
});


app.get("/", function(req, res) {
  res.render("index");
});
app.listen(PORT, function() {
  console.log(`server up and running on ${PORT}`);
});
