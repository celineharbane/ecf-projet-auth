const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.end();
  next();
});

app.get('/', (req, res) => res.send(`
<!DOCTYPE html>
<html><body>
<h1>TEST AUTH</h1>
<button onclick="test()">TESTER</button>
<div id="result"></div>
<script>
async function test() {
  try {
    const res = await fetch('/api/test', {method: 'POST'});
    const data = await res.json();
    document.getElementById('result').innerHTML = '<h2 style="color:green">‚úÖ CA MARCHE: ' + data.message + '</h2>';
  } catch(e) {
    document.getElementById('result').innerHTML = '<h2 style="color:red">‚ùå ERREUR: ' + e.message + '</h2>';
  }
}
</script>
</body></html>
`));

app.post('/api/test', (req, res) => {
  console.log('Ìæâ API APPEL√âE !');
  res.json({message: 'SERVEUR OK!'});
});

app.listen(4000, () => console.log('Ì∫Ä VA SUR: http://localhost:4000'));
