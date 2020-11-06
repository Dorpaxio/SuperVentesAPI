const router = require('express').Router();

router.use('/membres', require('./membres'));
router.use('/produits', require('./produits'));

module.exports = router;
