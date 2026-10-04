import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';
import { getDb } from './database/db';
import { seedDatabase } from './database/seed';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Static files for production deployment
const clientDistPath = path.resolve(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  // If request begins with /api, pass to 404 handler
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <html>
          <body style="background:#0a0c10;color:#00ff88;font-family:monospace;padding:2rem;">
            <h2>The Last Commit API Server is running.</h2>
            <p>Status: Healthy</p>
            <p>API Base: <a href="/api/health" style="color:#00e5ff">/api/health</a></p>
            <p>Admin API: /api/admin/*</p>
            <p>Client build not detected at ${clientDistPath}. Run <code>npm run build</code> to compile the frontend.</p>
          </body>
        </html>
      `);
    }
  });
});

// Start Server
async function startServer() {
  try {
    console.log('⚡ Initializing Database...');
    await getDb();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`🚀 The Last Commit Backend Server`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🔐 Admin: admin@thelastcommit.dev / LastCommit2026!`);
      console.log(`⚡ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`===============================================`);
    });
  } catch (err) {
    console.error('Fatal error starting server:', err);
    process.exit(1);
  }
}

startServer();
