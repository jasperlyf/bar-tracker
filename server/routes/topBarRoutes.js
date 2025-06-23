const express = require("express");
const router = express.Router();
const TopBar = require("../models/topBar");
const seedData = require("../seed/top100Bars"); // put your seed array here

router.post("/seed", async (req, res) => {
    try {
        await TopBar.deleteMany(); // reset
        const inserted = await TopBar.insertMany(seedData);
        res.json({ inserted: inserted.length });
    } catch (err) {
        res.status(500).json({ error: "Seeding failed", details: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const bars = await TopBar.find().sort({ rank: 1 });
        res.json(bars);
    } catch (err) {
        res.status(500).json({ error: "Fetch failed", details: err.message });
    }
});

module.exports = router;
