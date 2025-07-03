const { supabase } = require('../config/supabaseClient');

const createAnnonce = async (req, res) => {
  const { titre, description } = req.body;
  const userId = req.user.id; // injecté par le middleware JWT

  if (!titre || !description) {
    return res.status(400).json({ error: 'Titre et description requis' });
  }

  const { data, error } = await supabase
    .from('annonces')
    .insert([{ titre, description, user_id: userId }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ message: 'Annonce publiée', annonce: data });
};

const getAnnonces = async (req, res) => {
  const { data, error } = await supabase
    .from('annonces')
    .select('id, titre, description, user_id');

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
};

module.exports = { createAnnonce, getAnnonces };
