const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const {storage} = require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({ storage });

// "/" routes
router
  .route("/")

  // Index route
  .get(wrapAsync(listingController.index))

  // Add new listing to database
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );
  
router.get("/search", wrapAsync(listingController.searchListing));
// New listing route
router.get("/new", isLoggedIn, wrapAsync(listingController.new));

router
  .route("/:id")

  // Update route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )

  // Delete route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deletListing))

  // Show route
  .get(wrapAsync(listingController.showListing));

// Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.edit));

module.exports = router;
