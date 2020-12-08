const Membre = require('../models/Membre');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../../config');
const fs = require('fs');
const Produit = require('../models/Produit');

const RSA_PRIVATE_KEY = fs.readFileSync(config.rsa_path);
const RSA_PUBLIC_KEY = fs.readFileSync(config.rsa_pub_path);

const createToken = exports.createToken = function (userId) {
    return jwt.sign({}, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: config.token_expiration,
        subject: userId.toString()
    });
}

exports.checkToken = function (req, res, next) {
    console.log(req.body)
    console.log(req.headers)
    return expressJwt({secret: RSA_PUBLIC_KEY, algorithms: ['RS256']})(req, res, function (error) {
        if (error) return res.status(error.status).json({...error, auth: false});
        Membre.findOne({_id: req.user.sub}, function (err, auth) {
            if (err) return res.status(500).send(err);
            if (!auth) return res.status(404).json({
                ok: false,
                message: 'Le token est bon mais impossible de trouver le membre.',
                auth: false
            });

            req.auth = auth;

            return next();
        });
    });
}

exports.getMembres = function (req, res) {
    Membre.find({}, function (err, membres) {
        if (err) return res.status(500).send(err);
        return res.status(200).json(membres);
    });
}

exports.connexion = function (req, res) {
    let {email, password} = req.body;
    if (!(email && password)) return res.status(400).json({
        ok: false,
        code: 'ME40001',
        message: 'Veuillez renseigner un email et un password.'
    });
    email = email.trim();

    Membre.findOne({email: email}, '+password', function (err, membre) {
        if (err) return res.status(500).send(err);
        if (!membre) return res.status(404).json({ok: false, code: 'ME40401', message: 'Membre introuvable.'});

        membre.comparePassword(password, function (err, match) {
            if (err) return res.status(500).send(err);
            let {password, ...noPassUser} = membre._doc;
            if (match) return res.status(200).json({
                ok: true,
                token: createToken(membre._id),
                expiresIn: config.token_expiration,
                user: noPassUser
            });
            return res.status(404).json({ok: false, code: 'ME40402', message: 'Mauvais mot de passe.'});
        });
    });
}

exports.createCompte = function (req, res) {
    const {email, password, nom, prenom} = req.body;
    if (!password) return res.status(400).json({
        ok: false,
        code: 'ME40002',
        message: 'Veuilliez spécifier un mot de passe.'
    });

    if (!/^\S{8,}/i.test(password)) {
        return res.status(409).json({
            ok: false,
            code: 'ME40901',
            message: 'Votre mot de passe doit avoir plus de 8 caractères.'
        });
    }

    if (!email) {
        return res.status(400).json({
            ok: false,
            code: 'ME40003',
            message: 'Veuilliez spécifier un email.'
        });
    }

    if (!nom) {
        return res.status(400).json({
            ok: false,
            code: 'ME40004',
            message: 'Veuilliez spécifier un nom.'
        });
    }

    if (!prenom) {
        return res.status(400).json({
            ok: false,
            code: 'ME40005',
            message: 'Veuilliez spécifier un prénom.'
        });
    }

    Membre.findOne({email}, function (err, membre) {
        if (err) return res.status(500).send(err);
        if (membre) {
            return res.status(400).json({
                ok: false,
                code: 'ME40006',
                message: 'Cet email est déjà utilisé.'
            });
        }

        const newMembre = new Membre({
            email,
            password,
            nom,
            prenom
        });

        newMembre.save(function (err, membre) {
            if (err) return res.status(500).send(err);
            const {password, ...noPassUser} = membre._doc;
            return res.status(200).json({
                ok: true,
                token: createToken(membre._id),
                expiresIn: config.token_expiration,
                user: noPassUser
            });
        });
    });
}

exports.checkMembre = function (req, res, next, membreId) {
    Membre.findOne({_id: membreId}, function (err, membre) {
        if (err) return res.status(membre);
        if (!membre) return res.status(404).json({
            ok: false,
            code: 'ME40403',
            message: 'Aucun ucun membre associé a cet identifiant.'
        });

        req.membre = membre;

        return next();
    });
}

exports.getMembre = function (req, res) {
    return res.status(200).send(req.membre);
}

exports.getPanier = function (req, res) {
    Membre.findOne({_id: req.membre._id})
        .select('panier')
        .populate('panier.produit')
        .exec(function (err, membre) {
            if (err) return res.status(500).send(err);
            return res.status(200).json(membre.panier || []);
        });
}

exports.updatePanier = function (req, res) {
    const {produitId} = req.body;
    let {quantity} = req.body;

    if (!produitId) return res.status(400).json({
        ok: false,
        code: 'ME40007',
        message: 'Merci de spécifier une produitId'
    });

    if (!quantity) quantity = 1;

    Produit.findOne({_id: produitId}, function (err, produit) {
            if (err) return res.status(500).send(err);
            if (!produit) return res.status(404).json({ok: false, message: `Le produit indiqué n'existe pas.`});

            const panier = req.membre._doc.panier || [];
            const existingProduit = panier.filter(p => p.produit == produitId)[0];
            const existingProduitQuantity = existingProduit ? existingProduit.quantity : 0;

            const newQuantity = existingProduitQuantity + quantity;

            let query;
            if (existingProduit) {
                let modif;
                if (newQuantity > 0) modif = {$set: {'panier.$': {produit: produitId, quantity: newQuantity}}};
                else modif = {$unset: {'panier.$': 1}};

                query = Membre.updateOne({
                    _id: req.membre._id,
                    'panier.produit': produitId
                }, modif);
            } else {
                query = Membre.updateOne({
                    _id: req.membre._id,
                }, {$push: {'panier': {produit: produitId, quantity: newQuantity}}});
            }
            query.exec(function (err, update) {
                if (err) return res.status(500).send(err);
                if (update.nModified === 0) return res.status(304).send();
                return res.status(204).send();
            });
        }
    );
}

exports.deletePanier = function (req, res) {
    Membre.updateOne({_id: req.membre._id}, {$set: {panier: []}}, function (err, update) {
        if(err) return res.status(500).send(err);
        if(update.nModified === 0) return res.status(304).send();
        return res.status(204).send();
    });
}
