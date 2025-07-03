const express = require('express');
const supabase = require('./config/supabase');
const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') return res.end();
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.static('public'));

// LOGIN avec Supabase
app.post('/api/auth/login', async (req, res) => {
  console.log('í´ LOGIN:', req.body);
  const { email, password } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.log('âŒ Erreur:', error.message);
      return res.status(401).json({ message: 'Identifiants invalides' });
    }
    
    console.log('âœ… Connexion rÃ©ussie pour:', data.user.email);
    res.json({ 
      message: 'Connexion rÃ©ussie avec Supabase !', 
      token: data.session.access_token,
      user: { 
        pseudo: data.user.email.split('@')[0], 
        email: data.user.email 
      }
    });
  } catch (error) {
    console.error('í²¥ Erreur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// REGISTER avec Supabase
app.post('/api/auth/register', async (req, res) => {
  console.log('í³ REGISTER:', req.body);
  const { email, password, pseudo } = req.body;
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { pseudo }
      }
    });
    
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.json({ 
      message: 'Inscription rÃ©ussie ! VÃ©rifiez votre email.', 
      user: { pseudo, email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.listen(3001, () => console.log('íº€ http://localhost:3001'));
