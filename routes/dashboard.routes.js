const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware")
const Dashboard = require("../models/Dashboard.model")
const User = require("../models/User.model");
const Post = require("../models/Post.model")
const Quote = require("../models/Quote.model")
const Image = require("../models/Image.model")
const Song = require("../models/Song.model");




// HOME --> retrieve all dashboards + populate users info
router.get("/", (req, res, next) => {
  Dashboard.find()
    .populate("users")
    .then((allDashboards) => {
      // console.log(allDashboards)
      res.json(allDashboards)
    })
    .catch((err) => res.json(err));
});




// CREATE Dashboard (add photo)
router.post("/create", (req, res, next) => {
  const { title, description } = req.body;
  const userId = req.payload._id

  Dashboard.create({ title, description, posts: [], users: [userId] })
    .then((dashboard) => {

      User.findByIdAndUpdate(userId, { $push: { dashboards: dashboard._id } })
        .then(() => res.json(dashboard))
        .catch((err) => res.json(err));
    })
});




// VIEW one Dashboard + all populates
router.get("/:dashboardId", (req, res, next) => {
  const { dashboardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dashboardId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Dashboard.findById(dashboardId)
  Dashboard.find()
    .populate({
      path: "users",
      select: "name email"
    })
    .populate({
      path: "posts",
      populate: {
        path: "idContent"
      }
    })

    .then((dashboard) => res.status(200).json(dashboard))
    .catch((err) => res.json(err));

});




// UPDATE on Dashboard (settings dashboard)
router.put("/:dashboardId/settings", (req, res, next) => {
  const { dashboardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dashboardId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Dashboard.findByIdAndUpdate(dashboardId, req.body, { new: true })
    .then((updatedDashboard) => res.json(updatedDashboard))
    .catch((err) => res.json(err));

});





// DELETE Dashboard
router.post("/:dashboardId/delete", isAuthenticated, (req, res, next) => {
  const { dashboardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dashboardId)) {
    res.status(400).json({ message: "Specified id is not valid" })
    return;
  };

  Dashboard.findByIdAndDelete(dashboardId)
    .then(() => res.status(200).json(`Dashboard wit the id: ${dashboardId} has been succesfully removed`))
    .catch((err) => res.json(err));
});




module.exports = router;
