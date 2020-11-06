const Marque = require('../models/Marque');

exports.getMarques = function (req, res) {
    Marque.find({}, function (err, marques) {
        if(err) return res.status(500).send(err);
        return res.status(200).json(marques);
    });
}