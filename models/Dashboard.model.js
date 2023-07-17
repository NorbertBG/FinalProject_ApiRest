const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const dashboardSchema = new Schema({
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    title: String,
    description: String,
    image: String,
    posts: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
      ]
    });
    
  const Dashboard = model('Dashboard', dashboardSchema);

module.exports = Dashboard;

