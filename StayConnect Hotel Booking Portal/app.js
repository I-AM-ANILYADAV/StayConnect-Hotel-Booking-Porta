const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const wrapAsync=require("./utils/wrapAsync.js");
const path=require("path");
const methodOverride=require("method-override");
//helps creating layouts or templates
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
//joi
const {listingSchema,reviewSchema}=require("./schema.js");
const { log } = require("console");
const Review=require("./models/review.js");
//authentications
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash= require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
// const { saveRedirectUrl }=require("./middleware.js")
require('dotenv').config();



const listingsRouter =require("./routes/listing.js");
const reviewsRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

const searchRoutes = require('./routes/Search.js'); 


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//for getting data in params
app.use(express.urlencoded({extended:true}));
//using methodoveride for coverting the route request 
app.use(methodOverride("_method"));
// for using ejs-mate for creating boilerplate and using it in new page
app.engine('ejs',ejsMate);
//for using css in ejs files
app.use(express.static(path.join(__dirname,"/public")));

// const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";

const dbUrl=process.env.ATLASTDB_URL;
main()
.then(()=>{
  console.log("Connected to db");
}).catch(err=>{console.log(err);})

async function main(){
    //  await mongoose.connect(MONGO_URL);
      await mongoose.connect(dbUrl);
}


const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,

});
store.on("error",()=>{
  console.log("Error in mongo session stroe",err);
});


const sessionOPtions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
    httpOnly:true
  },
};

app.get("/",(req,res)=>{
 res.redirect("/listings");
});




app.use(session(sessionOPtions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// // Apply saveRedirectUrl middleware globally
// app.use(saveRedirectUrl);

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  
  next();
});



app.use("/listings",listingsRouter);//created a route
app.use("/listings/:id/reviews",reviewsRouter);//creted router
app.use("/",userRouter);
app.use('/', searchRoutes);

 

app.all("*",(req,res,next)=>{
  return next(new ExpressError(404,"page not found"));
})


app.use((err,req,res,next)=>{
  let {statusCode=500,message="something wrong"}=err;
  res.status(statusCode).render("listings/error.ejs",{message});
  // res.status(statusCode).send(message);
 

})
app.listen(8080,()=>{
  console.log("listning to server");
  })
