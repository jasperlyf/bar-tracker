const mongoose = require("mongoose");

const barVisitSchema = new mongoose.Schema({
    bar: { type: String, required: true },
    address: { type: String, required: false },
    country: { type: String, required: false },
    date: { type: String, required: true },
    ratings: {
        vibe: { type: Number, min: 1, max: 5 },
        service: { type: Number, min: 1, max: 5 },
        drinks: { type: Number, min: 1, max: 5 },
    },
});

module.exports = mongoose.model("BarVisit", barVisitSchema);