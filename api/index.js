// Vercel Serverless Function adapter
// Menggunakan Express app dari backend/server.js sebagai handler
import app from "../backend/server.js";

export default function handler(req, res) {
  return app(req, res);
}
