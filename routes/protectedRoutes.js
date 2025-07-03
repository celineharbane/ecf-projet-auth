const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

router.get('/mon-espace', auth, (req, res) => {
  res.status(200).json({ message: `Bienvenue dans ton espace protégé, ${req.user.email} 👋` });
});

module.exports = router;
