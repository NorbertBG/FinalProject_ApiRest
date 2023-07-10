const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware")
const Dashboard = require("../models/Dashboard.model")
const Quote = require("../models/Quote.model")
const Post = require("../models/Post.model")



// HOME --> retrieve all dashboards + popu users info
router.get("/", (req, res, next) => {
  Dashboard.find()
    .then((allDashboards) => {
      // console.log(allDashboards)
      res.json(allDashboards)
    })
    .catch((err) => res.json(err));
});



// CREATE Dashboard
router.get("/create", isAuthenticated, (req, res, next) => {
  res.json("hola")
});




// CREATE Dashboard
router.post("/create", isAuthenticated, (req, res, next) => {
  const { title, description } = req.body;
  const userId = req.payload._id

  Dashboard.create({ title, description, posts: [], users: [userId] })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});




// DELETE Dashboard
router.post("/:dashboardId/delete", isAuthenticated, (req, res, next) => {
  const { dashboardId } = req.params;

  Dashboard.findByIdAndDelete(dashboardId)
    .then(() => res.status(200).json("Dashboard deletted"))
    .catch((err) => res.json(err));
});





// VIEW one Dashboard
router.get("/:dashboardId", (req, res, next) => {
  const { dashboardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dashboardId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Dashboard.findById(dashboardId)
    .then((dashboard) => res.status(200).json(dashboard))
    .catch((err) => res.json(err));

});




// CREATE one Quote Post inside a Dashboard
router.post("/:dashboardId/create-quote", isAuthenticated, (req, res, next) => {
  // Available Data:
  const { dashboardId } = req.params
  const { text } = req.body
  const authorId = req.payload._id

    Quote.create({ text: text }) 
      .then((quote) => {
        Post.create({ idContent: quote._id, format: 'Quote', author: authorId })
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



module.exports = router;
