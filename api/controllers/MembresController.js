const Membre = require('../models/Membre');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../../../config');
const fs = require('fs');

const RSA_PRIVATE_KEY = fs.readFileSync(config.rsa_path);
const RSA_PUBLIC_KEY = fs.readFileSync(config.rsa_pub_path);

const createToken = exports.createToken = function (userId) {
    return jwt.sign({}, RSA_PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: config.token_expiration,
        subject: userId.toString()
    });
}

const checkToken = exports.checkToken = function (req, res, next) {
    return expressJwt({secret: RSA_PUBLIC_KEY, algorithms: ['RS256']})(req, res, function (error) {
        if (error) return res.status(error.status).send(error);
        Membre.findOne({_id: req.user.sub}, function (err, user) {
            if (err) return res.status(500).send(err);
            if (!user) return res.status(404).json({
                ok: false,
                message: 'Le token est bon mais impossible de trouver le membre.'
            });

            req.user = user;

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
    email = email.trim();
    if (!(email && password)) return res.status(400).json({
        ok: false,
        code: 'ME40001',
        message: 'Veuillez renseigner un email et un password.'
    });

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
        if(err) return res.status(500).send(err);
        if(membre) {
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
            if(err) return res.status(500).send(err);
            const {password, ...noPassUser} = membre;
            return res.status(200).json({
                ok: true,
                token: createToken(membre._id),
                expiresIn: config.token_expiration,
                user: noPassUser
            });
        });
    });
}
