const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const pathSchema = new Schema(
  {
    title: {
      type: String,
    },

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Path = model("Path", pathSchema);

module.exports = Path;
