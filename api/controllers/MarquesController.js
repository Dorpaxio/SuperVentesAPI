const Marque = require('../models/Marque');

exports.getMarques = function (req, res) {
    Marque.find(req.query, function (err, marques) {
        if (err) return res.status(500).send(err);
        return res.status(200).json(marques);
    });
}

exports.getMarque = function (req, res) {
    return res.status(200).json(req.marque);
}

exports.checkMarque = function (req, res, next, marqueId) {
    Marque.findOne({_id: marqueId}, function (err, marque) {
        if (err) return res.status(500).send(err);
        if (!marque) return res.status(404).json({
            ok: false,
            code: "MA40401",
            message: "La marque n'existe pas."
        });
        req.marque = marque;
        return next();
    })
}

exports.createMarque = function (req, res) {
    const newMarque = new Marque(req.body);
    newMarque.save(function (err, marque) {
        if (err) return res.status(500).send(err);
        return res.status(201).json(marque);
    });
}

exports.deleteMarque = function (req, res) {
    Marque.deleteOne({_id: req.marque._id}, function (err, result) {
        if (err) return res.status(500).send(err);
        if (result.deletedCount === 0) return res.status(304).send();
        return res.status(204).send();
    });
}
