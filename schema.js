const joi=require("joi");


  module.exports.listingschema = joi.object({
    listing: joi.object({
      title: joi.string().required(),
      description: joi.string().required(),
      location: joi.string().required(),
      country: joi.string().required(),
      price: joi.number().required().min(0),
      url: joi.string().default("https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-…").allow("",null),
    }).required(),
  });
   
module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().required().min(1).max(5),
        comment:joi.string().required(),
    }).required(),
})