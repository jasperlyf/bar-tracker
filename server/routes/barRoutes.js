const express = require("express");
const router = express.Router();
const BarVisit = require("../models/barVisit");

// POST: Add a new bar visit
router.post("/", async (req, res) => {
    try {
        const visit = new BarVisit(req.body);
        await visit.save();
        res.status(201).json(visit);
    } catch (err) {
        console.error("❌ Failed to save visit:", err.message);
        res.status(400).json({ error: err.message });
    }
});

// GET: Fetch all visits
router.get("/", async (req, res) => {
    try {
        const visits = await BarVisit.find().sort({ date: -1 });
        res.json(visits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
