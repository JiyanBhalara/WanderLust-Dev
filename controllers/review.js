const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
    const { rating, comment } = req.body.review;
    const { id } = req.params;
    const listing = await Listing.findById(id);
    const newReview = new Review({ rating, comment });
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Your Review Has Been Added")
    res.redirect(`/listings/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Your Review Deleted Successfully");
    res.redirect(`/listings/${id}`);
}