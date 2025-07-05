const express = require("express");
const router = express.Router();
const MyList = require("../models/myList");

// GET all saved bars
router.get("/", async (req, res) => {
    const items = await MyList.find();
    res.json(items);
});

// POST new bar to list
router.post("/", async (req, res) => {
    const newItem = new MyList(req.body);
    const saved = await newItem.save();
    res.status(201).json(saved);
});

// ✅ DELETE saved bar by ID
router.delete("/:id", async (req, res) => {
    try {
        await MyList.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete" });
    }
});

module.exports = router;
