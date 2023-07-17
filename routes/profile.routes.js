const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

//Importin all middlewares
const upload = require('../config/cloudinary.config');


const User = require("../models/User.model")




// VIEW Profile info--> retrieve all user info
router.get("/profile", (req, res, next) => {
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
router.put("/profile", (req, res, next) => {
  const userId = req.payload._id;
  const { userName } = req.body;

  User.findByIdAndUpdate(userId, { userName }, { new: true })
    .then((updatedProfile) => res.json(updatedProfile))
    .catch((err) => res.json(err));
});




// ADD a profile Image
router.post('/profile/image', upload.single('profileImage'), (req, res, next) => {
  const userId = req.payload._id;
  const imageUrl = req.file.secure_url;

  User.findByIdAndUpdate(userId, { profileImage: imageUrl }, { new: true })
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
