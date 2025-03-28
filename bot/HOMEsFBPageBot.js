const axios = require('axios');
require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
let BOT_ACTIVE = true; // ✅ Default: Bot is ON

// 📦 Expose toggle functions (optional control panel idea)
module.exports.toggleBot = (status) => {
  BOT_ACTIVE = status;
  console.log(`🔁 Bot switched ${BOT_ACTIVE ? "ON" : "OFF"}`);
};

// 📩 Bot message handler
module.exports.handleMessage = async (senderPsid, receivedMessage) => {
  if (!BOT_ACTIVE) {
    console.log("🚫 Bot is currently OFF. Ignoring message.");
    return;
  }

  if (receivedMessage.text) {
    const userText = receivedMessage.text;
    const aiReply = await getMistralReply(userText);

    const response = {
      text: aiReply || "🤖 Sorry, I couldn’t understand that."
    };

    callSendAPI(senderPsid, response);
  }
};

function callSendAPI(senderPsid, response) {
  axios.post(`https://graph.facebook.com/v17.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    recipient: { id: senderPsid },
    message: response
  }).then(() => {
    console.log('✅ Sent AI reply!');
  }).catch(err => {
    console.error('❌ Error sending reply:', err.response?.data || err.message);
  });
}

async function getMistralReply(message) {
  try {
    const res = await axios.post("https://api.mistral.ai/v1/chat/completions", {
      model: "mistral-small",
      messages: [
        { role: "system", content: "You are a helpful math and Arduino assistant." },
        { role: "user", content: message }
      ],
      temperature: 0.7
    }, {
      headers: {
        "Authorization": `Bearer ${MISTRAL_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("❌ Error calling Mistral API:", err.response?.data || err.message);
    return null;
  }
}
