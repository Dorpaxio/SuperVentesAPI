const Produit = require('../models/Produit');

exports.getProduits = function (req, res) {
    Produit.find({}, function (err, produits) {
        if(err) return res.status(500).send(err);
        return res.status(200).json(produits);
    });
}