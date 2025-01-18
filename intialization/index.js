const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const {Mongo_URL} = require("../app.js");
const data = require("./data.js");

console.log(Mongo_URL)
main().catch(err => console.log(err));
async function main() {
    //Connection to MongoDB
    await  mongoose.connect(Mongo_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }) 
}

async function intializeData(){
    await Listing.deleteMany({});
    data.data.map((obj)=>{
        obj.owner = "66c60de636053f404ce86c20";
    })
    await Listing.insertMany(data.data);
    console.log("Data saved successfully")
}

intializeData();