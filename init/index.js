const initdata=require("./data.js");
const mongoose = require('mongoose');
const Listing=require("../model/listing.js"); 

const Mongo_url='mongodb://127.0.0.1:27017/WanderWise';

main().then((res)=>{
    console.log("connection successfull");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(Mongo_url);
}

const initDB=async()=>{
   await Listing.deleteMany({});
    await Listing.insertMany(initdata.data)
    console.log("data was initialized");
}
initDB();