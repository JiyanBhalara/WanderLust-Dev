const Listing = require("../models/listing");
const mapToken = process.env.MAP_TOKEN;
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geoCodingClient = mbxGeoCoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  const allListing = await Listing.find({});
  res.render("./Listings/index.ejs", { allListing });
};

module.exports.searchListing = async(req,res)=>{
  let {search, category} = req.query;
  let listings = {};
  if (category === 'Trending') {
    listings= await Listing.find({});
  } else {
    listings = await Listing.find({
      $or: [
          { title: { $regex: new RegExp(`^${search}$`, 'i') } }, // Search by name
          { country: { $regex: new RegExp(`^${search}$`, 'i') } }, // Search by country
          { location: { $regex: new RegExp(`^${search}$`, 'i') } },//Search by location
          {category: { $regex: new RegExp(`^${category}$`, 'i') } }
      ]
    })
    
  }
  
  
  if (listings.length > 0) {
      res.render("./Listings/searchListing.ejs", {listings});
  } else {
    const message = "No Listings Found";
    res.render("./Listings/Error.ejs", { message});
  } 
}

module.exports.new = async (req, res) => {
  res.render("./Listings/CreateListing.ejs");
};

module.exports.createListing = async (req, res) => {
  let response = await geoCodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();
    
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  await newListing.save();
  req.flash("success", "Listing Added Successfully");
  res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  let originalListingImg = listing.image.url;
  originalListingImg = originalListingImg.replace(
    "/upload",
    "/upload/h_200,w_250"
  );
  if (!listing) {
    req.flash("error", "Listing You are Looking For Doesn't Exit");
    res.redirect("/listings");
  } else {
    res.render("./Listings/UpdateListing.ejs", { listing, originalListingImg });
  }
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
  }
  await listing.save();
  req.flash("success", "Listing Updated Successfully");
  res.redirect(`/listings/${id}`);
};

module.exports.deletListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const ShowListing = await Listing.findById(id)
  .populate("reviews")
  .populate("owner");
  if (!ShowListing) {
    req.flash("error", "Listing You Are Looking For Doesn't Exit");
    res.redirect("/listings");
  } else {
    res.render("./Listings/showListing.ejs", { ShowListing});
  }
};
