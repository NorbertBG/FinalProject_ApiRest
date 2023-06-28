const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const imageSchema = new Schema(
  {
    path: {
      type: String,
      required: [true, "Path is required."],
    },

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Image = model("Image", imageSchema);

module.exports = Image;
