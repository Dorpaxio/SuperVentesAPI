const Panier = require('../models/Panier');

/**
 * Retourne le panier courant d'un utilisateur, le panier retourné est open
 * @param req
 * @param res body contient la liste des produits et leur quantité
 */
exports.getPanier = function (req, res) {
    Panier.findOne({membreId: req.membre._id, status: 'open'})
        .populate('produits.produit')
        .select('produits')
        .exec(function (err, panier) {
            if (err) return res.status(500).send(err);
            if (!panier) return res.status(200).json([]);
            return res.status(200).json(panier.produits);
        });
}

exports.checkPanier = function (req, res, next, panierId) {
    Panier.findOne({_id: panierId, status: 'open'})
        .populate('membre')
        .populate('produits.produit')
        .exec(function (err, panier) {
            if (err) return res.status(500).send(err);
            if (!panier) return res.status(404).json({
                ok: false,
                code: 'PA40401',
                message: 'Cet id ne correspond à aucun panier.'
            });

            req.panier = panier;
            return next();
        });
}

exports.updatePanier = function (req, res) {
    const {produitId, quantity} = req.body;

    if (!produitId) return res.status(400).json({
        ok: false,
        code: 'PA40001',
        message: 'Merci de spécifier un produitId.'
    });

    const currentPanierProduct = req.panier.produits.filter(({produit}) => produit._id === produitId);
    let currentPanierProductQuantity;
    if(currentPanierProduct.length === 0) {
        req.panier.produits.push({
           produit: produitId,
           quantity
        });
    }
    else currentPanierProductQuantity = currentPanierProduct[0].quantity;

    if(currentPanierProductQuantity - quantity <= 0) {
        if(currentPanierProduct > 0) {
        }
    }

}
