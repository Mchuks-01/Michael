const { handleMessage } = require('../bot/HOMEsFBPageBot');
require('dotenv').config();

module.exports = async (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'default-token';

  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token === VERIFY_TOKEN) {
      console.log('✅ Webhook verified!');
      res.statusCode = 200;
      res.end(challenge);
    } else {
      console.warn('❌ Verification failed!');
      res.statusCode = 403;
      res.end('Forbidden');
    }
    return;
  }

  if (req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);

        console.log("🔔 Incoming POST body:", JSON.stringify(data, null, 2));

        if (data.object === 'page') {
          data.entry.forEach(entry => {
            const webhookEvent = entry.messaging?.[0];

            if (webhookEvent && webhookEvent.sender && webhookEvent.message) {
              const senderPsid = webhookEvent.sender.id;
              handleMessage(senderPsid, webhookEvent.message);
            }
          });
          res.statusCode = 200;
          res.end('EVENT_RECEIVED');
        } else {
          console.warn('❗ Invalid webhook event received');
          res.statusCode = 404;
          res.end('Invalid Webhook Event');
        }
      } catch (err) {
        console.error('❌ Failed to parse POST body', err);
        res.statusCode = 400;
        res.end('Bad Request');
      }
    });

    return;
  }

  res.statusCode = 405;
  res.end('Method Not Allowed');
};


  
