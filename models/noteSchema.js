var mongoose = require("mongoose");

var Schema = mongoose.schema;

var NoteSchema = new Schema({
  body: {
    type: String
  }
}); 

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;
