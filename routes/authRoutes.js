const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const validate = require('../middleware/validation');

// Route POST pour l’inscription
router.post('/register', validate.register, register);

// Route POST pour la connexion
router.post('/login', validate.login, login);

module.exports = router;
