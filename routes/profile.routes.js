const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware")
const Dashboard = require("../models/Dashboard.model")
const Quote = require("../models/Quote.model")



module.exports = router;
