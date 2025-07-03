const express = require('express');
const path = require('path');
const app = express();
const port = 3002;

// CORS
app.use((req, res, next) => {
  console.log(`í³¨ ${req.method} ${req.url}`);
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/auth/login', (req, res) => {
  console.log('í´ Login:', req.body);
  const { email, password } = req.body;
  if (email === 'test@example.com' && password === '123456') {
    res.json({ message: 'Connexion rÃ©ussie', token: 'fake-token', user: { pseudo: 'TestUser', email } });
  } else {
    res.status(401).json({ message: 'Identifiants invalides' });
  }
});

app.post('/api/auth/register', (req, res) => {
  console.log('í³ Register:', req.body);
  const { email, password, pseudo } = req.body;
  if (!email || !password || !pseudo) {
    return res.status(400).json({ message: 'Tous les champs sont requis' });
  }
  res.status(201).json({ message: 'Inscription rÃ©ussie', token: 'fake-token', user: { pseudo, email } });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Serveur OK', timestamp: new Date().toISOString() });
});

app.listen(port, '127.0.0.1', () => {
  console.log(`âœ… Serveur: http://127.0.0.1:${port}`);
});
