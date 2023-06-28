const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const contentSchema = new Schema({
    type: String, // Tipo de contenido (imagen, texto, playlist, etc.)
    // Otros campos específicos del tipo de contenido
  });

  const Content = model('Content', contentSchema);

  module.exports = Content;