const { supabase } = require('../config/supabaseClient');

const getUser = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Utilisateur introuvable' });
  res.json(data);
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  if (req.user.id !== userId) return res.status(403).json({ error: 'Accès interdit' });

  const { pseudo, localité, téléphone, avatar_url } = req.body;

  const { error } = await supabase
    .from('users')
    .update({ pseudo, localité, téléphone, avatar_url })
    .eq('id', userId);

  if (error) return res.status(500).json({ error: 'Erreur lors de la mise à jour' });

  res.json({ message: 'Profil mis à jour' });
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  if (req.user.id !== userId) return res.status(403).json({ error: 'Accès interdit' });

  const { error } = await supabase.from('users').delete().eq('id', userId);
  if (error) return res.status(500).json({ error: 'Erreur lors de la suppression' });

  res.json({ message: 'Compte supprimé' });
};

module.exports = { getUser, updateUser, deleteUser };
