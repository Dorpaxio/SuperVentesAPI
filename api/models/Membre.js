const mongoose = require('mongoose');

const membreSchema = new mongoose.Schema({
    nom: {type: String, required: true},
    prenom: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, select: false}
});

module.exports = mongoose.model('Membres', membreSchema);
