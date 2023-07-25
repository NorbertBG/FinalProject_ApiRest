const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Importin all middlewares
const upload = require('../config/cloudinary.config');

// All Models imported
const Dashboard = require("../models/Dashboard.model")
const User = require("../models/User.model");




// HOME --> retrieve all dashboards + populate users info
router.get("/home", (req, res, next) => {

  const userId = req.payload._id
console.log(userId)
  User.findById(userId)
    .populate("dashboards")
    .then((user) => {
      // user.dashboards will now contain the dashboards associated with the user
      res.json(user.dashboards);
    })
    .catch((err) => res.json(err));
});




// HOME --> Adding a new user in an existing dashboard with the dashboard id provided by email
router.put("/referral-code", (req, res, next) => {
  const { dashboardId } = req.body;
  const userId = req.payload._id;

  // Update the Dashboard model to add the userId in the users array
  Dashboard.findByIdAndUpdate(
    dashboardId,
    { $push: { users: userId } },
    { new: true }
  )
    .then((dashboard) => {
      console.log("User and Dashboard linked successfully");

      // Now, update the User model to add the dashboardId in the dashboards array
      User.findByIdAndUpdate(
        userId,
        { $push: { dashboards: dashboardId } },
        { new: true }
      )
        .then(() => {
          console.log("Dashboard added to User successfully");
          res.status(200).json({ message: "User and Dashboard linked successfully" });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});




// CREATE Dashboard (add photo)
router.post("/create", upload.single('image'), (req, res, next) => {
  const { title, description } = req.body;
  const userId = req.payload._id
  const imageUrl = req.file.path;

  Dashboard.create({ title, description, posts: [], image: imageUrl, users: [userId]  })
    .then((dashboard) => {

      User.findByIdAndUpdate(userId, { $push: { dashboards: dashboard._id } })
        .then(() => res.json(dashboard))
        .catch((err) => res.json(err));
    })
});




router.get("/dashboard/:dashboardId", async (req, res, next) => {
  const { dashboardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dashboardId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  try {
    const dashboard = await Dashboard.findById(dashboardId)
      .populate({
        path: "users",
        select: "name email"
      })
      .populate({
        path: "posts",
        populate: {
          path: "idContent",
          // Select only necessary fields for each post format
          select: " -createdAt -updatedAt"
        }
      })
      .exec();

    if (!dashboard) {
      res.status(404).json({ message: "Dashboard not found" });
      return;
    }

    // Sort the posts array by timestamp in descending order
    dashboard.posts.sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json(dashboard);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});




// VIEW settings Dashboard 
router.get("/dashboard/:dashboardId/settings", (req, res, next) => {
  const { dashboardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dashboardId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Dashboard.findById(dashboardId)
    .then((dashboardSettins) => res.json(dashboardSettins))
    .catch((err) => res.json(err));

});




// UPDATE on Dashboard (settings dashboard)
router.put("/dashboard/:dashboardId/settings", upload.single("image"), (req, res, next) => {
  const { dashboardId } = req.params;
  const imageUrl = req.file ? req.file.path : null; 
  const { title, description } = req.body
  
  if (!mongoose.Types.ObjectId.isValid(dashboardId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  // Create an object to store the updated profile data
  const updatedDashboardData = { title, description };
const updatedDashboard = {  }
  if (imageUrl) {
    updatedDashboard.image = imageUrl;
  }

  Dashboard.findByIdAndUpdate(dashboardId,  updatedDashboardData ,{ new: true })
    .then((updatedData) => res.json(updatedData))
    .catch((err) => res.json(err));

});





// DELETE Dashboard
router.delete("/dashboard/:dashboardId/delete", (req, res, next) => {
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
