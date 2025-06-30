const mongoose = require("mongoose");

const topBarSchema = new mongoose.Schema({
    rank: { type: Number, required: true },
    name: { type: String, required: true },
    city: String,
    country: String,
    address: String,
    imageUrl: String,
});

module.exports = mongoose.model("TopBar", topBarSchema);
