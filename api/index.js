const path = require('path');
const Module = require('module');
const originalRequire = Module.prototype.require;

let app = null;

// Handle importing the compiled server
function getApp() {
  if (!app) {
    try {
      // Load the compiled server and make it work with Vercel
      const serverModule = require('../dist/index.cjs');
      app = serverModule;
    } catch (error) {
      console.error('Failed to load server:', error);
      throw error;
    }
  }
  return app;
}

module.exports = async (req, res) => {
  try {
    const server = getApp();
    // If server is an Express app, handle the request
    if (server && typeof server === 'function') {
      return server(req, res);
    }
    res.status(500).json({ error: 'Server not initialized' });
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
