const mongoose = require('mongoose');

const marqueSchema = new mongoose.Schema({
    nom: {type: String, required: true}
});

module.exports = mongoose.model('Marques', marqueSchema);