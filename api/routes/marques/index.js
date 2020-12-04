const router = require('express').Router();
const marqueController = require('../../controllers/MarquesController');

router.route("")
    .get(marqueController.getMarques)
    .post(marqueController.createMarque);


router.param("marqueId",marqueController.checkMarque);
router.route("/:marqueId")
    .get(marqueController.getMarque)
    .delete(marqueController.deleteMarque);

module.exports = router;
