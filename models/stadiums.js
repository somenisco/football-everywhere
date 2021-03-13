const mongoose = require("mongoose");
const Schema = mongoose.Schema; // defining a model


const StadiumSchema = new Schema({
  title: String,
  image: String,
  description: String,
  capacity: Number,
  location: String
});

module.exports = mongoose.model('Stadium', StadiumSchema);