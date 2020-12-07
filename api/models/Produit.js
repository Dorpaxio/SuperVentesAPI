const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
    nom: {type: String, required: true},
    prix: {type: Number, required: true},
    categorie: {type: String, required: true},
    description: {type: String, required: true}
});

produitSchema.index({'$**': 'text'},
    {
        weights: {
            'nom': 10,
            'categorie': 5,
            'prix': 3,
            'description': 1,
        }
    }
);

module.exports = mongoose.model('Produits', produitSchema);
