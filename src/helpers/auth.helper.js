const config = require('../config/api.config');

const getAuthHeaders = () => ({
  Authorization: `Bearer ${config.token}`,
  'Content-Type': 'application/json'
});

// If you want just Auth without Content-Type
const getAuthHeadersOnly = () => ({
  Authorization: `Bearer ${config.token}`
});

// Export them
module.exports = {
  getAuthHeaders,
  getAuthHeadersOnly,
};

