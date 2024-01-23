const express=require("express");
const router=express.Router();
const {wrapAsync}=require("../middleware.js");
const {validatelisting}=require("../middleware.js");
const{isLoggedIn,isOwner}=require("../middleware.js");
const ListingController=require("../controller/listing.js");
const multer  = require('multer');
const {storage} =require("../cloudconfig.js");
const upload = multer({ storage });

// Index route
router.route("/")
.get(wrapAsync(ListingController.index))
.post(upload.single('listing[url]'),validatelisting, wrapAsync(ListingController.createListing));


// new Listing 
router.get("/new",isLoggedIn,ListingController.newListingForm)



//show route
router.route("/:id")
.get( wrapAsync(ListingController.showListing))
.put( upload.single('listing[url]'),validatelisting, isOwner,wrapAsync( ListingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing));

//update form 
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(ListingController.updateListingForm));

module.exports=router;