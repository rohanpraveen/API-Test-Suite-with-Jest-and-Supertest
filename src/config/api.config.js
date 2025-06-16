require('dotenv').config();

module.exports = {
  baseURL: process.env.API_BASE_URL || 'https://sdet-api.reckitplus.com',
  token: process.env.API_TOKEN,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.API_TOKEN}`
  }
};

