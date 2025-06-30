const mongoose = require("mongoose");

const barVisitSchema = new mongoose.Schema({
    bar: { type: String, required: true },            // Name of bar
    address: { type: String, required: true },        // Full address
    country: { type: String, required: true },        // Country name
    date: { type: String, required: true },           // Date of visit (YYYY-MM-DD)
    drink: String,                                    // Drink name (optional)
    cost: Number,                                     // Total cost (optional)
    people: [String],                                 // People you went with
    rating: {                                         // Ratings section
        vibe: { type: Number, min: 1, max: 5 },
        service: { type: Number, min: 1, max: 5 },
        drinks: { type: Number, min: 1, max: 5 },
    }
});

module.exports = mongoose.model("BarVisit", barVisitSchema);
