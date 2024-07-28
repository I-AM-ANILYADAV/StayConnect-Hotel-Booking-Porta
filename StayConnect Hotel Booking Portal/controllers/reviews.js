const Review=require("../models/review");
const Listing=require("../models/listing");


module.exports.createReview=async(req,res)=>{
    let listing= await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    console.log("new review saved");
    req.flash("success","new Review");
    res.redirect(`/listings/${listing._id}`);
  
   }

module.exports.deleteReview= async (req, res) => {
  try {
    const { id, reviewId } = req.params;
  
    // Log IDs
    console.log(`Listing ID: ${id}`);
    console.log(`Review ID: ${reviewId}`);
    
    // Find the listing and log its reviews
    let listing = await Listing.findById(id);
    if (!listing) {
      console.log("Listing not found");
      req.flash("error", "Listing not found");
      return res.redirect('/listings');
    }
    console.log("Before pulling review:", listing.reviews);
  
    // Pull the review ID from the reviews array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    // Find the updated listing and log its reviews
    listing = await Listing.findById(id);
    console.log("After pulling review:", listing.reviews);
  
    // Delete the review document
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted");
  
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("Error deleting review:", err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect('back');
  }
};




// async (req, res) => {
//     let { id, reviewId } = req.params;
  
//     // Log IDs
//     console.log(`Listing ID: ${id}`);
//     console.log(`Review ID: ${reviewId}`);
    
//     // Find the listing and log its reviews
//     let listing = await Listing.findById(id);
//     if (!listing) {
//       console.log("Listing not found");
//       return res.redirect('/listings');
//     }
//     console.log("Before pulling review:", listing.reviews);
  
//     // Pull the review ID from the reviews array
//     await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
//     // Find the updated listing and log its reviews
//     listing = await Listing.findById(id);
//     console.log("After pulling review:", listing.reviews);
  
//     // Delete the review document
//     await Review.findByIdAndDelete(reviewId);
//     req.flash("success","Review Deleted");
  
//     res.redirect(`/listings/${id}`);
//   };