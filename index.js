require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const webhook = require('./api/webhook'); // Make sure the path is correct

const app = express();
const PORT = process.env.PORT || 3002;

app.use(bodyParser.json());

// ✅ Mount webhook router — supports both GET and POST
app.use('/webhook', webhook);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
