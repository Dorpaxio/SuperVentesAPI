const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const membreSchema = new mongoose.Schema({
    nom: {type: String, required: true},
    prenom: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true, select: false},
    panier: [
        {
            _id: false,
            produit: {type: mongoose.Types.ObjectId, ref: 'Produits', required: true},
            quantity: {type: Number, default: 1}
        }
    ]
});

membreSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(this.password, salt, (error, hash) => {
            if (err) return next(err);

            this.password = hash;
            next();
        });
    });
});

membreSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Membres', membreSchema);
