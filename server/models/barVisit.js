const mongoose = require("mongoose");

const barVisitSchema = new mongoose.Schema({
    bar: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: Date, required: true },
    drink: { type: String },
    cost: { type: Number, required: true },
    people: [{ type: String }],
    rating: {
        vibe: { type: Number, min: 1, max: 5 },
        service: { type: Number, min: 1, max: 5 },
        drinks: { type: Number, min: 1, max: 5 }
    }
});

module.exports = mongoose.model("BarVisit", barVisitSchema);
