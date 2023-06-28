const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const dashboardSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    contents: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Content' }
      ]
    });
    
  const Dashboard = model('Dashboard', dashboardSchema);



module.exports = Dashboard;

