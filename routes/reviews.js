const express = require("express");
const router = express.Router({ mergeParams: true });

const CatchAsync = require("../utils/CatchAsync");

const Stadium = require("../models/stadiums");
const Review = require("../models/review");

const { reviewSchema } = require("../schemas.js");

const { validateReview, isLoggedin, isreviewAuthor } = require("../middlewares");
const reviews = require("../controllers/reviewcontrol");

router.post(
  "/",
  isLoggedin,
  validateReview,
  CatchAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedin,
  isreviewAuthor, 
  CatchAsync(reviews.deleteReview));

module.exports = router;
