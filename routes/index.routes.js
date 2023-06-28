const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Dashboard = require("../models/Dashboard.model")

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.post("/dashboards", (req, res, next) => {
  const { title, description } = req.body;

  Dashboard.create({ title, description, contents: [] })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/dashboards", (req, res, next) => {
  Dashboard.find()
    .then((allDashboards) => {
      // console.log(allDashboards)
      res.json(allDashboards)
    })
    .catch((err) => res.json(err));
});

router.get("/dashboards/:dashboardId", (req, res, next) => {
  const { dashboardId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(dashboardId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Dashboard.findById(dashboardId)
    .then((dashboard) => res.status(200).json(dashboard))
    .catch((err) => res.json(err));

});

module.exports = router;
