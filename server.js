const express = require('express');
const path = require('path');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// Proxy endpoint for Anthropic API
app.post('/api/analyze', (req, res) => {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  console.log('API Key present:', !!apiKey);
  console.log('API Key prefix:', apiKey ? apiKey.substring(0, 20) : 'MISSING');
  console.log('Request model:', req.body && req.body.model);

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const body = JSON.stringify(req.body);

  const options = {
    hostname: 'api.anthropic.com',
    port: 443,
    path: '/v1/messages',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', function(chunk) { data += chunk; });
    proxyRes.on('end', function() {
      console.log('Anthropic status:', proxyRes.statusCode);
      console.log('Anthropic response:', data.substring(0, 500));
      try {
        res.status(proxyRes.statusCode).json(JSON.parse(data));
      } catch(e) {
        res.status(proxyRes.statusCode).send(data);
      }
    });
  });

  proxyReq.on('error', function(err) {
    console.log('Proxy error:', err.message);
    res.status(500).json({ error: err.message });
  });

  proxyReq.write(body);
  proxyReq.end();
});

// Health check - visit isitreelapp.com/api/health to verify setup
app.get('/api/health', function(req, res) {
  var apiKey = process.env.ANTHROPIC_API_KEY;
  res.json({ 
    status: 'ok', 
    hasApiKey: !!apiKey,
    keyPrefix: apiKey ? apiKey.substring(0, 15) + '...' : 'MISSING'
  });
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, function() {
  console.log('IsItReel running on port ' + PORT);
});
