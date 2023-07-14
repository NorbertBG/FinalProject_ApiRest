const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");


const Dashboard = require("../models/Dashboard.model")
const Quote = require("../models/Quote.model")
const Song = require("../models/Song.model")

router.post("/:dashboardId/create-quote", (req, res, next) => {
    const { dashboardId } = req.params;
    const { text } = req.body;
    const authorId = req.payload._id;
  
    Quote.create({ text })
      .then((quote) => {
        if (!quote) {
          return res.status(500).json({ error: "Failed to create quote" });
        }
  
        Post.create({ idContent: quote._id, format: 'Quote', author: authorId })
          .then((post) => {
            if (!post) {
              return res.status(500).json({ error: "Failed to create post" });
            }
  
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
      .then((dashboard) => res.status(200).json(dashboard))
      .catch((err) => {
        res.status(500).json({ error: "Failed to create quote", err });
      });
  });
  


// CREATE one Song Post inside a Dashboard
router.post("/:dashboardId/create-song", (req, res, next) => {
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
