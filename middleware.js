const Listing=require("./model/listing");
const Review=require("./model/review");
const { listingschema } = require("./schema");
const {reviewSchema}=require("./schema");
const ExpressError = require("./utils/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
   
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to make changes");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl ){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}
 
module.exports.isOwner= async(req,res,next)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of listing"); 
        return res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isAuthor= async(req,res,next)=>{
    let{id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of listing"); 
        return res.redirect(`/listings/${id}`);
    }
    next();

}


module.exports.validatelisting=(req,res,next)=>{
let{error}=listingschema.validate(req.body);
if(error){
    console.log(error);
    let errMsg=error.details.map((ele)=> ele.message).join(",");
    throw new ExpressError(400,errMsg);
}
else{
    next();
}
}



module.exports.vlaidatereview=(req,res,next)=>{
    let{error}=reviewSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMgs=error.details.map((ele)=>ele.message).join(",");
        throw new ExpressError(400,errMgs)
    }
    else{
        next();
    }
}
module.exports.wrapAsync=(fn) =>{
    return function (req, res, next) {
      fn(req, res, next).catch((err) => {
        next(err);
      });
    };
  }

  

