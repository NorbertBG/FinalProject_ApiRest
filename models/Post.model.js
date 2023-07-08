const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const contentSchema = new Schema({
    author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    // Otros campos específicos del tipo de contenido
    // idSong:  { type: mongoose.Schema.Types.ObjectId, ref: 'Song' },
    // idQuote:  { type: mongoose.Schema.Types.ObjectId, ref: 'Quote' },
    // idImage:  { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    
    idContent: { type: mongoose.Schema.Types.ObjectId, refPath: typeModel, required: true },
    typeModel: { type: String, required: true, enum: ['Song', 'Quote', 'Image']}
  },

  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

  const Content = model('Content', contentSchema);

  module.exports = Content;

