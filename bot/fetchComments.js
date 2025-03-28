const axios = require('axios');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const PAGE_ID = process.env.PAGE_ID;

async function fetchLatestComments() {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${PAGE_ID}/posts?fields=comments.limit(5){message,id,from}&access_token=${PAGE_ACCESS_TOKEN}`
    );
    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching comments:', error.response?.data || error.message);
    return [];
  }
}

module.exports = fetchLatestComments;
