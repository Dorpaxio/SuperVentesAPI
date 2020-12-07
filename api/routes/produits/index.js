const router = require('express').Router();
const produitsController = require('../../controllers/ProduitsController');
const membresController = require('../../controllers/MembresController');

router.route("")
    .get(produitsController.getProduits)
    .post(membresController.checkToken, produitsController.addProduit);

router.route("/categories")
    .get(produitsController.getCategories);

router.param("produitId",produitsController.checkProduit);
router.route("/:produitId")
    .get(produitsController.getProduit);

module.exports = router;
