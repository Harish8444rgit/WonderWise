const express=require("express");
const router=express.Router({mergeParams:true});
const {vlaidatereview}=require("../middleware.js");
const {wrapAsync}=require("../middleware.js");
const{isLoggedIn ,isAuthor}=require("../middleware.js");

const ReviewController=require("../controller/review.js")

//adding reviews
router.post("/", vlaidatereview,isLoggedIn, wrapAsync(ReviewController.createReview ));


//deleting reviewa
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(ReviewController.destroyReview) );
module.exports=router;

