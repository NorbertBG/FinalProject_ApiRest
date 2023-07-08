const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware")
const Dashboard = require("../models/Dashboard.model")
const Quote = require("../models/Quote.model")


router.get("/", (req, res, next) => {
  res.json("All good in here");
});


router.get("/dashboards/:dashboardId/create", isAuthenticated, (req,res,next) => {
  res.json("hola")
})


router.post("/dashboards/create", isAuthenticated, (req, res, next) => {
  const { title, description } = req.body;
  const userId  = req.payload._id

  Dashboard.create({ title, description, posts: [], users: [userId]})
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

router.post("/dashboards/:dashboardId/create/quote", (req, res, next) => {
// Dades disponibles:
// { dashboardId } = req.params
// { text } = req.body
// id d'usuari (_id) = request.payload._id
console.log("1st Try")
// const authorId = req.payload._id
// const { text } = req.body
// console.log("hey")
// const result = Quote.create({text})
// console.log(result)
// .then((quote) => {
//   Post.create({author: authorId})
// })
// .catch((err) => res.json(err));


// 1. Crear Quote (Create)
// 2. Crear document de tipo post (Create)
// 3. Actualitzar Dashboard (Update)
// 4. 
})

module.exports = router;
