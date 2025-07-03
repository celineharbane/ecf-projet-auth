const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cutyzehbhsnfgobxqwaj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1dHl6ZWhiaHNuZmdvYnhxd2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1MjYwOTcsImV4cCI6MjA2NzEwMjA5N30.u6MdpG4N3GNzTEYyGpayVPUaP4AeClF9nN7fIyEknw0';

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
