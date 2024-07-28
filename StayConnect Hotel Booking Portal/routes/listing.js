const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
// const {listingSchema}=require("../schema.js");
// const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");

const {isLoggedin, isOwner,validateListing} =require("../middleware.js");

const listingController=require("../controllers/listings.js");

const multer  = require('multer');
const {storage}=require("../cloudConfig.js")
const upload = multer({storage});





//using router.route
// for index route 

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedin,
  upload.single('listing[image][url]'),
  validateListing,
  wrapAsync(listingController.createListing));




 //new route
 router.get("/new",isLoggedin,listingController.renderNewForm);


// show,update and delete
 //req function use to deconstruct the data inside the body and directly update the data
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
  isLoggedin,
  isOwner,
  validateListing,
  wrapAsync(listingController.renderUpdate))
.delete(
    isLoggedin,
    isOwner,
    wrapAsync(listingController.deleteListing));
  
   //edit route
   router.get("/:id/edit",isLoggedin,isOwner,wrapAsync(listingController.renderEditForm));

  
module.exports=router;