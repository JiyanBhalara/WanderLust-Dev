const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../middleware.js");
const reviewController = require("../controllers/review.js");

router
  .route("/")
  //Add review to associated listing route
  .post(
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview)
  );

router
  .route("/:reviewId")
  //Delete review to associated author and listing
  .delete(
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
  );

module.exports = router;
