const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// All Models imported
const Dashboard = require("../models/Dashboard.model")
const Quote = require("../models/Quote.model")
const Post = require("../models/Post.model")
const Song = require("../models/Song.model")
const Image = require("../models/Image.model")

const upload = require('../config/cloudinary.config');



// CREATE one Quote Post inside a Dashboard
router.post("/dashboard/:dashboardId/create-quote", (req, res, next) => {
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
      .catch((err) => {
        res.status(500).json({ error: "Failed to create quote", err });
      });
  });
  



// CREATE one Song Post inside a Dashboard
router.post("/dashboard/:dashboardId/create-song", (req, res, next) => {
    // Available Data:
    const { dashboardId } = req.params
    const { path } = req.body
    const authorId = req.payload._id

    Song.create({ path: path })
        .then((song) => {
          if (!song) {
            return res.status(500).json({ error: "Failed to create song" });
          }
            Post.create({ idContent: song._id, format: 'Song', author: authorId })
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
router.post("/dashboard/:dashboardId/create-image", upload.single('path'), (req, res, next) => {
    // Available Data:
    const { dashboardId } = req.params
    const authorId = req.payload._id
    const imageUrl = req.file.path;

    console.log(imageUrl)
    Image.create({ path: imageUrl })
        .then((image) => {
          if (!image) {
            return res.status(500).json({ error: "Failed to create image" });
          }
            Post.create({ idContent: image._id, format: 'Image', author: authorId })
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
