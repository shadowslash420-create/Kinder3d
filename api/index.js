const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from dist/public
const publicPath = path.join(__dirname, '..', 'dist', 'public');
app.use(express.static(publicPath));

// API routes - proxy to the built server if needed
// For now, just serve the static files and fall through to index.html for SPA routing
app.use('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

module.exports = app;
