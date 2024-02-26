const { default: axios } = require("axios");
const Listing = require("../model/listing");
const mapApiKey = process.env.map_api_key; 

module.exports.index = async (req, res) => {
  const alllisting = await Listing.find({});
  res.render("listings/index.ejs", { alllisting });
};

module.exports.newListingForm = (req, res) => {
  res.render("listings/new.ejs");
};
module.exports.createListing = async (req, res) => {
  let newListing = new Listing(req.body.listing);
  if (typeof req.file != "undefined") {
    let url = req.file.path;
    newListing.url = url;
  }
  const location = `${newListing.location},${newListing.country}`;
  // Construct the API URL for forward geocoding
  const apiUrl = `https://api.maptiler.com/geocoding/${location}.json?&fuzzyMatch=true&limit=3&key=${mapApiKey}`;
    const response = await axios.get(apiUrl);
    
  newListing.geometry= response.data.features[0].geometry;
  newListing.owner = req.user._id;
  await newListing.save();
  console.log(newListing);
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing your requested for does not exist!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};
module.exports.updateListingForm = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing your requested for does not exist!");
    res.redirect("/listings");
  }
  let orignalImg = listing.url;
  orignalImg = orignalImg.replace(
    "/upload",
    "/upload/ar_1.0,c_fill,h_150/bo_2px_solid_red"
  );
  res.render("listings/edit.ejs", { listing, orignalImg });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = req.body.listing;
  listing = await Listing.findByIdAndUpdate(id, listing, { new: true });

  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
