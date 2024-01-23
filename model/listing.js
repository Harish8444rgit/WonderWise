const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./review");

// Main schema for the listing
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  
  url: {
    type: String,
    default:"https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-…",
    
    set:(v)=>
    v===""?"https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-…":v,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner:{
    type:Schema.Types.ObjectId,
      ref:"User",
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
  }

})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
