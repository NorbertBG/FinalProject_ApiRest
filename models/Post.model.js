const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const postSchema = new Schema({
    author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Otros campos específicos del tipo de contenido
    // idSong:  { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    // idQuote:  { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
    // idImage:  { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    
    format: { type: String, required: true, enum: ['song', 'quote', 'image'] },
    idContent: { type: mongoose.Schema.Types.ObjectId, refPath: 'format', required: true },
  },

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

  const Post = model('Post', postSchema);

  module.exports = Post;

