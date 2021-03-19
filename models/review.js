const mongoose = require("mongoose");
const Schema = mongoose.Schema; // defining a model

const reviewSchema = new Schema({
    body: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Review", reviewSchema);
