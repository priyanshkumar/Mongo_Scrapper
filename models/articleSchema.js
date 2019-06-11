var mongoose = require("mongoose");

var Schema = mongoose.schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    require: true
  },
  author: {
    type: String
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
