const express = require("express");
const router = express.Router();
const BarVisit = require("../models/barVisit");

// GET all bar visits
router.get("/", async (req, res) => {
    try {
        const visits = await BarVisit.find();
        res.json(visits);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET top-rated bars
router.get("/top-rated", async (req, res) => {
    try {
        const topRated = await BarVisit.aggregate([
            {
                $group: {
                    _id: "$bar",
                    count: { $sum: 1 },
                    avgVibe: { $avg: "$ratings.vibe" },
                    avgService: { $avg: "$ratings.service" },
                    avgDrinks: { $avg: "$ratings.drinks" },
                    country: { $first: "$country" },
                },
            },
            {
                $project: {
                    bar: "$_id",
                    count: 1,
                    country: 1,
                    avgRating: {
                        $avg: ["$avgVibe", "$avgService", "$avgDrinks"]
                    },
                    _id: 0
                },
            },
            { $sort: { avgRating: -1 } },
            { $limit: 10 },
        ]);

        res.json(topRated);
    } catch (err) {
        console.error("Error fetching top-rated bars:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// POST new visit
router.post("/", async (req, res) => {
    try {
        const visit = new BarVisit(req.body);
        await visit.save();
        res.status(201).json(visit);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update visit
router.put("/:id", async (req, res) => {
    try {
        const updated = await BarVisit.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE visit
router.delete("/:id", async (req, res) => {
    try {
        await BarVisit.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
