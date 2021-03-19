const mongoose = require("mongoose");
const Schema = mongoose.Schema; // defining a model
const Review = require("./review");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

//function to shrink images to 200px
ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const StadiumSchema = new Schema({
  title: String,
  images: [ImageSchema],
  description: String,
  capacity: Number,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// middleware to delete all related items to this object
StadiumSchema.post("findOneAndDelete", async function (data) {
  if (data) {
    await Review.deleteMany({
      _id: {
        $in: data.reviews,
      },
    });
  }
  // console.log("DELETED!!");
});

module.exports = mongoose.model("Stadium", StadiumSchema);
