const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
    nom: {type: String, required: true},
    type: {type: String, required: true},
    prix: {type: Number, required: true},
    categorie: {type: String, required: true},
    description: {type: String, required: true}
});

module.exports = mongoose.model('Produits', produitSchema);
