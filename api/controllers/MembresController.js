const Membre = require('../models/Membre');

exports.getMembres = function (req, res) {
    Membre.find({}, function (err, membres) {
        if(err) return res.status(500).send(err);
        return res.status(200).json(membres);
    });
}
