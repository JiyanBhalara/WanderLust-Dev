const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const Review = require("./review.js");

//Creating a schema for our listings
const listing = new Schema({
    title:{
        type: String,
        require: true,
    },

    description:{
        type: String,
        require: true,
    },

    image:{
        url: String,
        filename: String,
    },
    
    price:{
        type: Number,
        require: true,
    },

    location:{
        type: String,
        require: true,
    },

    country:{
        type: String,
        require: true,
    },

    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],

    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    geometry: {
        type: {
          type: String, 
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        },
    },

    category:{
        type: String,
        enum: ["Trending", "Castles", "Mountains", "Amazing pools", "Arctic", "Treehouse", "Rooms", "Camping", "Iconic cities"],
        required: true
    }
});

listing.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})
const Listing = mongoose.model("Listing", listing);

//Exporting Listing schema
module.exports = Listing;
