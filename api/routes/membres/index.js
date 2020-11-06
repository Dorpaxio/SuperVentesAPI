const router = require('express').Router();
const membresController = require('../../controllers/MembresController');

router.route('')
    .get(membresController.getMembres);

router.route('/connexion')
    .post(membresController.connexion);

router.route('/inscription')
    .post(membresController.createCompte);

module.exports = router;
