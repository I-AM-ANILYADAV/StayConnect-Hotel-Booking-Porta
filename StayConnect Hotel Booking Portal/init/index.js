const mongoose=require("mongoose");
const initData =require("./data.js");
const Listing=require("../models/listing.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main()
.then(()=>{
  console.log("Connected to db");
}).catch(err=>{console.log(err);})

async function main(){
    await mongoose.connect(MONGO_URL);
}


const initDB = async()=>{
    //deleting the randome data from datbase
   await  Listing.deleteMany({});
   //initData is object .
   initData.data=initData.data.map((obj)=>({...obj,owner:"666dc7e3baebe7a49077b214"}));
   await Listing.insertMany(initData.data);
   console.log("data was initialized");


}

initDB();
