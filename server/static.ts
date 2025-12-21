import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Try multiple possible paths for the built client files
  let distPath = path.resolve(__dirname, "public");
  
  // In Vercel/bundled environments, try parent directory
  if (!fs.existsSync(distPath)) {
    distPath = path.resolve(__dirname, "..", "public");
  }
  
  // Last resort: try current working directory
  if (!fs.existsSync(distPath)) {
    distPath = path.resolve(process.cwd(), "dist", "public");
  }
  
  if (!fs.existsSync(distPath)) {
    console.error(`Could not find the build directory at: ${distPath}`);
    console.error(`Current __dirname: ${__dirname}`);
    console.error(`Current cwd: ${process.cwd()}`);
    console.error(`Checking paths:`);
    console.error(`- ${path.resolve(__dirname, "public")}: ${fs.existsSync(path.resolve(__dirname, "public"))}`);
    console.error(`- ${path.resolve(__dirname, "..", "public")}: ${fs.existsSync(path.resolve(__dirname, "..", "public"))}`);
    console.error(`- ${path.resolve(process.cwd(), "dist", "public")}: ${fs.existsSync(path.resolve(process.cwd(), "dist", "public"))}`);
    throw new Error(
      `Could not find the build directory, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, {
    maxAge: "1h",
    etag: false,
  }));

  // fall through to index.html if the file doesn't exist (for SPA routing)
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
