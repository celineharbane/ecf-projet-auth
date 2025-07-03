const express = require('express');
const router = express.Router();

// ✅ Route de test pour vérifier que le serveur fonctionne
router.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'API opérationnelle 🚀' });
});

module.exports = router;
