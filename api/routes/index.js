const router = require('express').Router();

router.use('/membres', require('./membres'));
router.use('/produits', require('./produits'));
router.use('/marques', require('./marques'));

module.exports = router;
