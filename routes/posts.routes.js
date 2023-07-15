const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// All Models imported
const Dashboard = require("../models/Dashboard.model")
const Quote = require("../models/Quote.model")
const Post = require("../models/Post.model")
const Song = require("../models/Song.model")
const Image = require("../models/Image.model")



// CREATE one Quote Post inside a Dashboard
router.post("/:dashboardId/create-quote", (req, res, next) => {
    const { dashboardId } = req.params;
    const { text } = req.body;
    const authorId = req.payload._id;
  
    Quote.create({ text })
      .then((quote) => {
        if (!quote) {
          return res.status(500).json({ error: "Failed to create quote" });
        }
  
        Post.create({ idContent: quote._id, format: 'quote', author: authorId })
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
          if (!song) {
            return res.status(500).json({ error: "Failed to create song" });
          }
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




// CREATE one Image Post inside a Dashboard
router.post("/:dashboardId/create-image", (req, res, next) => {
    // Available Data:
    const { dashboardId } = req.params
    const { path } = req.body
    const authorId = req.payload._id

    Image.create({ path: path })
        .then((image) => {
          if (!image) {
            return res.status(500).json({ error: "Failed to create image" });
          }
            Post.create({ idContent: image._id, format: 'image', author: authorId })
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
            res.status(500).json({ error: "Failed to create image", err });
        });
});

module.exports = router;
