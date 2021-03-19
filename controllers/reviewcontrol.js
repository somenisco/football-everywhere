const Stadium = require("../models/stadiums");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const stadium = await Stadium.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    stadium.reviews.push(review);
    await review.save();
    await stadium.save();
    req.flash("success", "successfully created a review!!");
    res.redirect(`/stadiums/${stadium._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    //$pull will remove that review by id from that stadium object
    await Stadium.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "successfully deleted the review!!");
    res.redirect(`/stadiums/${id}`);
};