const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabaseClient');

// ✅ Contrôleur d'inscription
const register = async (req, res) => {
  try {
    console.log('📥 Données reçues dans register:', req.body);

    const { pseudo, email, mot_de_passe } = req.body;

    // Vérifie si l'utilisateur existe déjà
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (checkError && checkError.code !== 'PGRST116') throw checkError;
    if (existingUser) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Insertion dans Supabase
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{ pseudo, email, password: hashedPassword }])
      .select()
      .single();

    if (insertError) throw insertError;

    // Génération du token JWT
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: {
        id: newUser.id,
        pseudo: newUser.pseudo,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error('❌ Erreur dans register:', err.message);
    res.status(500).json({ error: "Erreur serveur lors de l’inscription" });
  }
};

// ✅ Contrôleur de connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        pseudo: user.pseudo,
        email: user.email
      }
    });
  } catch (err) {
    console.error('❌ Erreur dans login:', err.message);
    res.status(500).json({ error: "Erreur serveur lors de la connexion" });
  }
};

module.exports = { register, login };
