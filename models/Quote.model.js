const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const quoteSchema = new Schema(
  {
    text: {
      type: String,
      required: [true, "Text is required."],
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Quote = model("Quote", quoteSchema);

module.exports = Quote;
