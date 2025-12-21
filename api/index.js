const { spawn } = require('child_process');
const path = require('path');
let server = null;

export default async function handler(req, res) {
  if (!server) {
    const serverPath = path.join(process.cwd(), 'dist', 'index.cjs');
    server = require(serverPath);
  }
  return server(req, res);
}
