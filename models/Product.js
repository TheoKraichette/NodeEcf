const mongoose = require('mongoose');
//Déclaration du Schéma de données
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  identifiant: {
    type: String,
    required: false
  },
  numLot: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  resume: {
    type: String,
    required: true
  },
  dispo: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;