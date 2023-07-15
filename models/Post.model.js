const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema({
    author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    format: { type: String, required: true, enum: ['Song', 'Quote', 'Image'] },
    idContent: { type: mongoose.Schema.Types.ObjectId, refPath: 'format', required: true },
  },

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

  const Post = model('Post', postSchema);

  module.exports = Post;

