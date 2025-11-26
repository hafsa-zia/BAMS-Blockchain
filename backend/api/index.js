// backend/api/index.js
const app = require("../app");

// Vercel will call this for /api/* requests
module.exports = (req, res) => {
  return app(req, res);
};
