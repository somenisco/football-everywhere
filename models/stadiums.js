const mongoose = require("mongoose");
const Schema = mongoose.Schema; // defining a model


const StadiumSchema = new Schema({
  title: String,
  description: String,
  capacity: String,
  location: String
});

module.exports = mongoose.model('Stadium', StadiumSchema);