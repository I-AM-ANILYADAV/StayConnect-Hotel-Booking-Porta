const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
// const ExpressError=require("../utils/ExpressError.js");
// const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview,isLoggedin, isReviewAuthor}=require("../middleware.js");

const ReviewController=require("../controllers/reviews.js");





//Review route
 //post
 router.post("/",
  isLoggedin,
  validateReview,
  wrapAsync(ReviewController.createReview));
  
   //delete route for review/
  
  router.delete("/:reviewId", 
    isLoggedin,
    isReviewAuthor,
    wrapAsync(ReviewController.deleteReview));

  module.exports=router;
  