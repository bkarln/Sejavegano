const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiKey = 'SUA_API_KEY_AQUI';
const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

app.post('/analisar', async (req, res) => {
  try {
    const payload = req.body;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao chamar a API Gemini' });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
