const mongoose = require("mongoose");

const myListSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: String,
    country: String,
    notes: String, // Optional: user note like "must try cocktails"
    addedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MyList", myListSchema); // Collection: mylists
