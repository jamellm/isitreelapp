const express = require('express');
const path = require('path');
const https = require('https');
const http = require('http');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Stripe Price IDs
const STRIPE_PRICES = {
  light: 'price_1TRYmzDhFdEbgvvOSIcb4rWP',
  founding: 'price_1TRYo5DhFdEbgvvOgnUPzgM4',
  pro: 'price_1TRYp4DhFdEbgvvO8u5awui6',
};

const RAILWAY_URL = 'https://isitreeel-ytdlp-production.up.railway.app';

// ── SESSION STORE ─────────────────────────────────────────────────────────────
// In-memory session store - maps sessionToken -> { tier, email, expires }
const sessions = new Map();

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function createSession(tier, email) {
  const token = generateToken();
  const expires = Date.now() + (30 * 24 * 60 * 60 * 1000); // 30 days
  sessions.set(token, { tier, email, expires });
  return token;
}

function getSession(token) {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expires < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session;
}

// ── TELEGRAM ALERTS ───────────────────────────────────────────────────────────
function sendTelegram(message) {
  var botToken = process.env.TELEGRAM_BOT_TOKEN;
  var chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  var body = JSON.stringify({
    chat_id: chatId,
    text: message,
    parse_mode: 'HTML',
  });

  var options = {
    hostname: 'api.telegram.org',
    port: 443,
    path: '/bot' + botToken + '/sendMessage',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  var req = https.request(options, function(res) {
    res.on('data', function() {});
  });
  req.on('error', function(err) {
    console.log('Telegram alert failed:', err.message);
  });
  req.write(body);
  req.end();
}

// Manual alert endpoint for Command Center
app.post('/api/alert', express.json(), function(req, res) {
  var message = req.body && req.body.message;
  if (!message) return res.status(400).json({ error: 'Message required' });
  sendTelegram(message);
  res.json({ sent: true });
});

// Raw body needed for Stripe webhook signature verification
app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// ── RAILWAY URL EXTRACTION ──────────────────────────────────────────────────
app.post('/api/extract-url', function(req, res) {
  var url = req.body.url;
  if (!url) return res.status(400).json({ error: 'URL required' });

  var body = JSON.stringify({ url: url });

  var options = {
    hostname: 'isitreeel-ytdlp-production.up.railway.app',
    port: 443,
    path: '/extract',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
    },
  };

  var https = require('https');
  var proxyReq = https.request(options, function(proxyRes) {
    var data = '';
    proxyRes.on('data', function(chunk) { data += chunk; });
    proxyRes.on('end', function() {
      try { res.status(proxyRes.statusCode).json(JSON.parse(data)); }
      catch(e) { res.status(500).json({ error: 'Failed to parse response' }); }
    });
  });
  proxyReq.on('error', function(err) {
    res.status(500).json({ error: 'Video download failed: ' + err.message });
  });
  proxyReq.write(body);
  proxyReq.end();
});

// ── ANTHROPIC PROXY ──────────────────────────────────────────────────────────
app.post('/api/analyze', function(req, res) {
  var apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  var body = JSON.stringify(req.body);
  var options = {
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

  var proxyReq = https.request(options, function(proxyRes) {
    var data = '';
    proxyRes.on('data', function(chunk) { data += chunk; });
    proxyRes.on('end', function() {
      try { res.status(proxyRes.statusCode).json(JSON.parse(data)); }
      catch(e) { res.status(proxyRes.statusCode).send(data); }
    });
  });
  proxyReq.on('error', function(err) { res.status(500).json({ error: err.message }); });
  proxyReq.write(body);
  proxyReq.end();
});

// ── STRIPE CHECKOUT ──────────────────────────────────────────────────────────
app.post('/api/checkout', function(req, res) {
  var stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) return res.status(500).json({ error: 'Stripe not configured' });

  var tier = req.body.tier;
  var priceId = STRIPE_PRICES[tier];
  if (!priceId) return res.status(400).json({ error: 'Invalid tier' });

  var origin = req.headers.origin || 'https://isitreelapp.com';
  var checkoutData = JSON.stringify({
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: origin + '?upgraded=true&tier=' + tier,
    cancel_url: origin + '?cancelled=true',
    allow_promotion_codes: true,
  });

  var options = {
    hostname: 'api.stripe.com',
    port: 443,
    path: '/v1/checkout/sessions',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + stripeKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  // Build form-encoded body for Stripe
  var formBody = 'mode=subscription'
    + '&line_items[0][price]=' + priceId
    + '&line_items[0][quantity]=1'
    + '&success_url=' + encodeURIComponent(origin + '?upgraded=true&tier=' + tier)
    + '&cancel_url=' + encodeURIComponent(origin + '?cancelled=true')
    + '&allow_promotion_codes=true';

  options.headers['Content-Length'] = Buffer.byteLength(formBody);

  var stripeReq = https.request(options, function(stripeRes) {
    var data = '';
    stripeRes.on('data', function(chunk) { data += chunk; });
    stripeRes.on('end', function() {
      try {
        var parsed = JSON.parse(data);
        res.json({ url: parsed.url, error: parsed.error });
      } catch(e) {
        res.status(500).json({ error: 'Stripe response error' });
      }
    });
  });
  stripeReq.on('error', function(err) { res.status(500).json({ error: err.message }); });
  stripeReq.write(formBody);
  stripeReq.end();
});

// ── STRIPE WEBHOOK (verify subscription) ────────────────────────────────────
app.post('/api/verify-session', function(req, res) {
  var stripeKey = process.env.STRIPE_SECRET_KEY;
  var sessionId = req.body.sessionId;
  if (!stripeKey || !sessionId) return res.status(400).json({ error: 'Missing params' });

  var options = {
    hostname: 'api.stripe.com',
    port: 443,
    path: '/v1/checkout/sessions/' + sessionId,
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + stripeKey },
  };

  var stripeReq = https.request(options, function(stripeRes) {
    var data = '';
    stripeRes.on('data', function(chunk) { data += chunk; });
    stripeRes.on('end', function() {
      try {
        var session = JSON.parse(data);
        var tier = 'free';
        var priceId = session.line_items && session.line_items.data && session.line_items.data[0] && session.line_items.data[0].price && session.line_items.data[0].price.id;
        if (priceId === STRIPE_PRICES.pro) tier = 'pro';
        else if (priceId === STRIPE_PRICES.founding) tier = 'founding';
        else if (priceId === STRIPE_PRICES.light) tier = 'light';
        res.json({ tier, email: session.customer_details && session.customer_details.email });
      } catch(e) {
        res.status(500).json({ error: 'Parse error' });
      }
    });
  });
  stripeReq.on('error', function(err) { res.status(500).json({ error: err.message }); });
  stripeReq.end();
});

// ── STRIPE WEBHOOK ───────────────────────────────────────────────────────────
app.post('/api/webhook', function(req, res) {
  var webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  var sig = req.headers['stripe-signature'];

  if (!webhookSecret || !sig) {
    return res.status(400).json({ error: 'Webhook secret not configured' });
  }

  // Verify webhook signature
  var payload = req.body;
  var expectedSig = crypto
    .createHmac('sha256', webhookSecret)
    .update(payload)
    .digest('hex');

  var sigParts = sig.split(',');
  var timestamp = '';
  var signatures = [];

  sigParts.forEach(function(part) {
    if (part.startsWith('t=')) timestamp = part.slice(2);
    if (part.startsWith('v1=')) signatures.push(part.slice(3));
  });

  var signedPayload = timestamp + '.' + payload;
  var computedSig = crypto
    .createHmac('sha256', webhookSecret)
    .update(signedPayload)
    .digest('hex');

  var isValid = signatures.some(function(s) { return s === computedSig; });
  if (!isValid) return res.status(400).json({ error: 'Invalid signature' });

  var event;
  try { event = JSON.parse(payload); }
  catch(e) { return res.status(400).json({ error: 'Invalid JSON' }); }

  // Handle subscription events
  if (event.type === 'checkout.session.completed') {
    var session = event.data.object;
    var priceId = session.line_items && session.line_items.data &&
      session.line_items.data[0] && session.line_items.data[0].price &&
      session.line_items.data[0].price.id;

    var tier = 'light';
    if (priceId === 'price_1TRYp4DhFdEbgvvO8u5awui6') tier = 'pro';
    else if (priceId === 'price_1TRYo5DhFdEbgvvOgnUPzgM4') tier = 'founding';
    else if (priceId === 'price_1TRYmzDhFdEbgvvOSIcb4rWP') tier = 'light';

    var email = session.customer_details && session.customer_details.email;
    var token = createSession(tier, email);

    // Store token mapped to Stripe session ID for retrieval
    sessions.set('stripe_' + session.id, { token, tier, email });
    console.log('New subscriber:', email, tier);
    sendTelegram('🎉 <b>New IsItReel Subscriber!</b>\n\nTier: ' + tier.toUpperCase() + '\nEmail: ' + (email || 'unknown') + '\nTime: ' + new Date().toLocaleString());
  }

  if (event.type === 'customer.subscription.deleted') {
    // Subscription cancelled - we can't easily revoke tokens without email lookup
    // but sessions expire in 30 days naturally
    console.log('Subscription cancelled');
  }

  res.json({ received: true });
});

// ── SESSION CREATION AFTER CHECKOUT ──────────────────────────────────────────
app.post('/api/create-session', function(req, res) {
  var stripeKey = process.env.STRIPE_SECRET_KEY;
  var sessionId = req.body.sessionId;
  if (!stripeKey || !sessionId) return res.status(400).json({ error: 'Missing params' });

  var options = {
    hostname: 'api.stripe.com',
    port: 443,
    path: '/v1/checkout/sessions/' + sessionId + '?expand[]=line_items',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + stripeKey },
  };

  var stripeReq = https.request(options, function(stripeRes) {
    var data = '';
    stripeRes.on('data', function(chunk) { data += chunk; });
    stripeRes.on('end', function() {
      try {
        var session = JSON.parse(data);
        if (session.payment_status !== 'paid') {
          return res.status(400).json({ error: 'Payment not completed' });
        }

        var priceId = session.line_items && session.line_items.data &&
          session.line_items.data[0] && session.line_items.data[0].price &&
          session.line_items.data[0].price.id;

        var tier = 'light';
        if (priceId === 'price_1TRYp4DhFdEbgvvO8u5awui6') tier = 'pro';
        else if (priceId === 'price_1TRYo5DhFdEbgvvOgnUPzgM4') tier = 'founding';
        else if (priceId === 'price_1TRYmzDhFdEbgvvOSIcb4rWP') tier = 'light';

        var email = session.customer_details && session.customer_details.email;
        var token = createSession(tier, email);

        res.json({ token, tier, email });
      } catch(e) {
        res.status(500).json({ error: 'Failed to verify session' });
      }
    });
  });
  stripeReq.on('error', function(err) { res.status(500).json({ error: err.message }); });
  stripeReq.end();
});

// ── VERIFY SESSION TOKEN ──────────────────────────────────────────────────────
app.post('/api/verify-token', function(req, res) {
  var token = req.body.token;
  var session = getSession(token);
  if (!session) return res.json({ valid: false, tier: 'free' });
  res.json({ valid: true, tier: session.tier, email: session.email });
});

// ── STRIPE CUSTOMER PORTAL ────────────────────────────────────────────────────
app.post('/api/customer-portal', function(req, res) {
  var stripeKey = process.env.STRIPE_SECRET_KEY;
  var email = req.body.email;
  if (!stripeKey || !email) return res.status(400).json({ error: 'Missing params' });

  // First find customer by email
  var searchOptions = {
    hostname: 'api.stripe.com',
    port: 443,
    path: '/v1/customers/search?query=email%3A%22' + encodeURIComponent(email) + '%22',
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + stripeKey },
  };

  var searchReq = https.request(searchOptions, function(searchRes) {
    var data = '';
    searchRes.on('data', function(chunk) { data += chunk; });
    searchRes.on('end', function() {
      try {
        var result = JSON.parse(data);
        var customerId = result.data && result.data[0] && result.data[0].id;
        if (!customerId) return res.status(404).json({ error: 'Customer not found' });

        var origin = req.headers.origin || 'https://isitreelapp.com';
        var portalBody = 'customer=' + customerId + '&return_url=' + encodeURIComponent(origin);

        var portalOptions = {
          hostname: 'api.stripe.com',
          port: 443,
          path: '/v1/billing_portal/sessions',
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + stripeKey,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(portalBody),
          },
        };

        var portalReq = https.request(portalOptions, function(portalRes) {
          var pData = '';
          portalRes.on('data', function(chunk) { pData += chunk; });
          portalRes.on('end', function() {
            try {
              var portal = JSON.parse(pData);
              res.json({ url: portal.url });
            } catch(e) { res.status(500).json({ error: 'Portal error' }); }
          });
        });
        portalReq.on('error', function(err) { res.status(500).json({ error: err.message }); });
        portalReq.write(portalBody);
        portalReq.end();
      } catch(e) { res.status(500).json({ error: 'Search error' }); }
    });
  });
  searchReq.on('error', function(err) { res.status(500).json({ error: err.message }); });
  searchReq.end();
});

// ── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get('/api/telegram-test', function(req, res) {
  var botToken = process.env.TELEGRAM_BOT_TOKEN;
  var chatId = process.env.TELEGRAM_CHAT_ID;
  res.json({
    hasBotToken: !!botToken,
    hasChatId: !!chatId,
    tokenPrefix: botToken ? botToken.substring(0, 10) + '...' : 'MISSING',
    chatId: chatId || 'MISSING'
  });
});

app.get('/api/health', function(req, res) {
  var apiKey = process.env.ANTHROPIC_API_KEY;
  var stripeKey = process.env.STRIPE_SECRET_KEY;
  res.json({
    status: 'ok',
    hasAnthropicKey: !!apiKey,
    hasStripeKey: !!stripeKey,
    keyPrefix: apiKey ? apiKey.substring(0, 15) + '...' : 'MISSING'
  });
});

// ── CLIENT ROUTING ───────────────────────────────────────────────────────────
app.get('/privacy', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'privacy.html'));
});

app.get('/terms', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});

app.get('/sitemap.xml', function(req, res) {
  res.setHeader('Content-Type', 'application/xml');
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});

app.get('/robots.txt', function(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  res.sendFile(path.join(__dirname, 'public', 'robots.txt'));
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, function() {
  console.log('IsItReel running on port ' + PORT);
});
