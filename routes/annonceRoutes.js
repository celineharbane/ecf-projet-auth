const express = require('express');
const router = express.Router();
const { createAnnonce, getAnnonces } = require('../controllers/annonceController');
const authenticate = require('../middleware/authMiddleware');

router.get('/', getAnnonces); // public
router.post('/', authenticate, createAnnonce); // protégé

module.exports = router;
