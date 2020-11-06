const router = require('express').Router();
const produitsController = require('../../controllers/ProduitsController');

router.route("")
    .get(produitsController.getProduits);

router.route("/categories")
    .get(produitsController.getCategories);

module.exports = router;