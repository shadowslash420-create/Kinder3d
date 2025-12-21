const path = require('path');

// Initialize app once
let appInstance = null;

async function getApp() {
  if (!appInstance) {
    try {
      const { createApp } = require('../dist/index.cjs');
      const { app } = await createApp();
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
    app(req, res);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
