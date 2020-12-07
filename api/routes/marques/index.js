const router = require('express').Router();
const marqueController = require('../../controllers/MarquesController');
const membresController = require('../../controllers/MembresController');

router.route("")
    .get(marqueController.getMarques)
    .post(membresController.checkToken, marqueController.createMarque);


router.param("marqueId", marqueController.checkMarque);
router.route("/:marqueId")
    .get(marqueController.getMarque)
    .delete(membresController.checkToken, marqueController.deleteMarque);

module.exports = router;
