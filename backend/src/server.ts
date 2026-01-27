import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './presentation/middleware/errorHandler.js';
import { notFound } from './presentation/middleware/notFound.js';
import { setupSwagger } from './presentation/swagger/swagger.js';
import authRoutes from './presentation/routes/authRoutes.js';
import userRoutes from './presentation/routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger/OpenAPI documentation
setupSwagger(app);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api', (_req, res) => {
  res.json({ message: 'API is running' });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app
  .listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  })
  .on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use.`);
      console.error(`💡 Try: kill -9 $(lsof -ti:${PORT})`);
      console.error(`💡 Or change PORT in .env file`);
      process.exit(1);
    } else {
      throw err;
    }
  });
