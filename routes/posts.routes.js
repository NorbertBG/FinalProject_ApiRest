const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware")
const Dashboard = require("../models/Dashboard.model")
const Quote = require("../models/Quote.model")
const Song = require("../models/Song.model")

// CREATE one Quote Post inside a Dashboard
router.post("/:dashboardId/create-quote", isAuthenticated, (req, res, next) => {
    // Available Data:
    const { dashboardId } = req.params
    const { text } = req.body
    const authorId = req.payload._id

    Quote.create({ text: text })
        .then((quote) => {
            Post.create({ idContent: quote._id, format: 'quote', author: authorId })
                .then((post) => {
                    Dashboard.findByIdAndUpdate(dashboardId, {
                        $push: { posts: post._id }
                    })
                        .then(() => {
                            res.status(200).json({ message: "Post created successfully" });
                        })
                        .catch((err) => {
                            res.status(500).json({ error: "Failed to update dashboard", err });
                        });
                })
                .catch((err) => {
                    res.status(500).json({ error: "Failed to create post", err });
                });
        })
        .catch((err) => {
            res.status(500).json({ error: "Failed to create quote", err });
        });
});


// CREATE one Song Post inside a Dashboard
router.post("/:dashboardId/create-song", isAuthenticated, (req, res, next) => {
    // Available Data:
    const { dashboardId } = req.params
    const { title } = req.body
    const authorId = req.payload._id

    Song.create({ title: title })
        .then((song) => {
            Post.create({ idContent: song._id, format: 'song', author: authorId })
                .then((post) => {
                    Dashboard.findByIdAndUpdate(dashboardId, {
                        $push: { posts: post._id }
                    })
                        .then(() => {
                            res.status(200).json({ message: "Post created successfully" });
                        })
                        .catch((err) => {
                            res.status(500).json({ error: "Failed to update dashboard", err });
                        });
                })
                .catch((err) => {
                    res.status(500).json({ error: "Failed to create post", err });
                });
        })
        .catch((err) => {
            res.status(500).json({ error: "Failed to create song", err });
        });
});

module.exports = router;
