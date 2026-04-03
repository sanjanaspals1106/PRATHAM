import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { logger } from './services/auditLogger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import triageRoutes from './routes/triage.routes';
import dashboardRoutes from './routes/dashboard.routes';
import exportRoutes from './routes/export.routes';
import auditRoutes from './routes/audit.routes';

const app: Application = express();

// Middleware
const allowedOrigins = env.CORS_ORIGIN.split(',').map(o => o.trim());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Pratham Backend',
    version: '1.0.0',
  });
});

// API Routes
app.use('/api/triage', triageRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/audit-logs', auditRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server only when running locally (not in Vercel serverless)
if (process.env.VERCEL !== '1') {
  const PORT = env.PORT;
  app.listen(PORT, () => {
    logger.info(`🚀 Pratham Backend running on port ${PORT}`);
    logger.info(`📊 Environment: ${env.NODE_ENV}`);
    logger.info(`🔗 CORS enabled for: ${env.CORS_ORIGIN}`);
    logger.info(`🏥 Pratham ready`);
  });
}

export default app;
