const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Importin all middlewares
const upload = require('../config/cloudinary.config');


const User = require("../models/User.model")




// VIEW Profile info--> retrieve all user info
router.get("/profile", (req, res, next) => {

    const userId = req.payload._id;
    console.log(`this is the userId, ${req.payload}`)
    User.findById(userId)
      .populate("dashboards")
      .then((userInfo) => {
        console.log(userInfo); // Check the user information
        res.json(userInfo);
      })
      .catch((err) => res.json(err));
  });
  



// UPDATE profile info including username and profile image
router.put("/profile", upload.single("profileImage"), (req, res, next) => {
  const userId = req.payload._id;
  const { userName } = req.body;
  const imageUrl = req.file ? req.file.path : null; // Check if an image is uploaded

  // Create an object to store the updated profile data
  const updatedProfileData = { userName };
  if (imageUrl) {
    updatedProfileData.profileImage = imageUrl;
  }

  User.findByIdAndUpdate(userId, updatedProfileData, { new: true })
    .then((updatedProfile) => res.json(updatedProfile))
    .catch((err) => res.json(err));
});





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
