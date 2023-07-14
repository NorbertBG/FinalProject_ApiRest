const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware")
const User = require("../models/User.model")



// VIEW Profile info--> retrieve all user info
router.get("/profile", isAuthenticated, (req, res, next) => {
    const userId = req.payload._id;
  
    User.findById(userId)
      .populate("dashboards")
      .then((userInfo) => {
        console.log(userInfo); // Check the user information
        res.json(userInfo);
      })
      .catch((err) => res.json(err));
  });
  


// UPDATE profile info
router.put("/profile", isAuthenticated, (req, res, next) => {

    const userId = req.payload._id

    User.findByIdAndUpdate(userId, req.body, { new: true })
        .then((updatedProfile) => res.json(updatedProfile))
        .catch((err) => res.json(err));
})



// DELETE profile
router.delete("/profile", (req, res, next) => {

    const userId = req.payload._id

    User.findByIdAndRemove(userId)
        .then(() => {
            res.json({ message: `User: ${userId} has been removed` })
        })
        .catch((err) => res.json(err));
})



module.exports = router;
