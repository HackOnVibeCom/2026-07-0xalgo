// Vercel serverless entry — mounts the Express API at /api/*.
// Frontend on HackOnVibe calls https://launch-twin.vercel.app/api/...
import app from "../server/index.js";

export default app;
