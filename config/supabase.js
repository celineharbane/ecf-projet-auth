const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cutyzehbhsnfgobxqwaj.supabase.co';
const supabaseKey = 'CLE';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
