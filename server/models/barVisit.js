const mongoose = require("mongoose");

const barVisitSchema = new mongoose.Schema({
    bar: { type: String, required: true },
    address: { type: String, required: true },
    country: { type: String, required: true },
    date: { type: String, required: true },
    drink: String,
    cost: Number,
    people: [String],
    ratings: {
        vibe: Number,
        service: Number,
        drinks: Number
    }
});

module.exports = mongoose.model("BarVisit", barVisitSchema); // collection: barvisits
