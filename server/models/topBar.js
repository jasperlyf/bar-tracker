const mongoose = require("mongoose");

const topBarSchema = new mongoose.Schema({
    rank: Number,
    name: String,
    city: String,
    country: String,
    address: String,
    imageUrl: String
});

module.exports = mongoose.model("TopBar", topBarSchema); // collection: topbars
