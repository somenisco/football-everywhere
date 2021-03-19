const Stadium = require("./models/stadiums");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");

const { StadiumSchema, reviewSchema } = require("./schemas.js");

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "Must be logged in!!");
        return res.redirect("/login");
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const stadium = await Stadium.findById(id);
  if (!stadium.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!!");
    return res.redirect(`/stadiums/${id}`);
  }
  next();
};

module.exports.validateStadium = (req, res, next) => {
  const { error } = StadiumSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  // console.log(error);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isreviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You don't have permission to do that!!");
    return res.redirect(`/stadiums/${id}`);
  }
  next();
};