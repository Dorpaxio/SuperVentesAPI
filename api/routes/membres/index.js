const router = require('express').Router();
const membresController = require('../../controllers/MembresController');

router.route('')
    .get(membresController.getMembres);

router.route('/connexion')
    .post(membresController.connexion);

router.route('/inscription')
    .post(membresController.createCompte);

router.param('membreId', membresController.checkMembre);

router.route('/:membreId')
    .get(membresController.getMembre);

router.route('/:membreId/panier')
    .get(membresController.getPanier)
    .post(membresController.updatePanier);

module.exports = router;
