const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Importin all middlewares
const upload = require('../config/cloudinary.config');

// All Models imported
const Dashboard = require("../models/Dashboard.model")
const User = require("../models/User.model");




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




// HOME --> Adding a new user in a existing dashboard wih the dashboard id provided by email
router.put("/referral-code", (req, res, next) => {
 
  const { dashboardId } = req.body;
  const userId = req.payload._id

    Dashboard.findByIdAndUpdate(
      dashboardId,
      { $push: { users: userId } },
      { new: true }
    )
      .then(() =>
        console.log("User and Dashboard linked successfully")
      )
      .catch((err) => console.log(err));
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




// VIEW settings Dashboard 
router.get("/:dashboardId/settings", (req, res, next) => {
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
router.post("/:dashboardId/delete", (req, res, next) => {
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
