const mongoose = require('mongoose');

const panierSchema = new mongoose.Schema({
    membre: {type: mongoose.Types.ObjectId, required: true, ref: 'Membres'},
    produits: [{
        type: {
            produit: {type: mongoose.Types.ObjectId, required: true},
            quantity: {type: Number, default: 1}
        }, ref: 'Produits'
    }],
    status: {type: String, enum: ['open', 'closed'], default: 'open'}
});

module.exports = mongoose.model('Paniers', panierSchema);
