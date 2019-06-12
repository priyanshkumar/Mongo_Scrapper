var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var axios = require("axios");

var app = express();
var PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost/mongoscrapper", {
  useNewUrlParser: true
});

app.get("/", function(req, res) {
  res.render("index");
});
app.listen(PORT, function() {
  console.log(`server up and running on ${PORT}`);
});
