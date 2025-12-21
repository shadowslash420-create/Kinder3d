// Initialize app once
let appInstance = null;

async function getApp() {
  if (!appInstance) {
    try {
      const { createApp } = require('../dist/index.cjs');
      const { app, httpServer } = await createApp();
      appInstance = app;
    } catch (error) {
      console.error('Failed to initialize app:', error);
      throw error;
    }
  }
  return appInstance;
}

module.exports = async (req, res) => {
  try {
    const app = await getApp();
    // Handle the request with Express middleware pattern
    return new Promise((resolve, reject) => {
      app(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch (error) {
    console.error('Error handling request:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  }
};
