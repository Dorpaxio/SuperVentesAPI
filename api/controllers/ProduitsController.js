const Produit = require('../models/Produit');

exports.getProduits = function (req, res) {
    const {sort, ...where} = req.query;
    const query = Produit.find(where);

    if(sort) query.sort([sort.split(',')].map(arr => {
        const [one, two] = arr[0].split('-');
        return [two ? two : one, two ? -1 : 1];
    }));

    query.exec(function (err, produits) {
        if (err) return res.status(500).send(err);
        return res.status(200).json(produits);
    });
}

exports.getCategories = function (req, res) {
    Produit.find({}, "categorie", function (err, produits) {
        if (err) return res.status(500).send(err);
        return res.status(200).json(produits.map(p => p.categorie));
    })
}

exports.addProduit = function (req, res) {
    const newProduit = new Produit(req.body);
    newProduit.save(function (err, produit) {
        if (err) return res.status(500).send(err);
        return res.status(201).json(produit);
    })
}

exports.checkProduit = function (req, res, next, produitId) {
    Produit.findOne({_id:produitId}, function (err,produit){
        if(err) return res.status(500).send(err);
        if(!produit) return res.status(404).json({
            ok:false,
            code:"PR40401",
            message:"Le produit n'existe pas."
        });
        req.produit = produit;
        return next();
    })
}

exports.getProduit = function (req,res){
    return res.status(200).json(req.produit);
}
