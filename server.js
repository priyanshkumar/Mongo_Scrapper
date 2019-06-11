var express = require("express");
var exphbs = require("express-handlebars");

var app = express();
var PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.listen(PORT, function() {
  console.log(`server up and running on ${PORT}`);
});
