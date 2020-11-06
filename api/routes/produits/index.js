const router = require('express').Router();
const produitsController = require('../../controllers/ProduitsController');

router.route("")
    .get(produitsController.getProduits)
    .post(produitsController.addProduit);

router.route("/categories")
    .get(produitsController.getCategories);

router.param("produitId",produitsController.checkProduit);
router.route("/:produitId")
    .get(produitsController.getProduit);

module.exports = router;