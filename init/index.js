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
   // first add user in db and then put your id
    // initdata.data=initdata.data.map((obj)=>({...obj,owner:"65aa5905954390f8b8b7a219"}));
    await Listing.insertMany(initdata.data)
    console.log("data was initialized");
}
initDB();