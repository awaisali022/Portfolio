import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import skillRoutes from './routes/skills.js';
import experienceRoutes from './routes/experience.js';
import educationRoutes from './routes/education.js';
import testimonialRoutes from './routes/testimonials.js';
import blogRoutes from './routes/blog.js';
import contactRoutes from './routes/contact.js';
import serviceRoutes from './routes/services.js';
import settingsRoutes from './routes/settings.js';
import mediaRoutes from './routes/media.js';

// Resolve ES Modules directories
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allows serving static uploads to frontend
}));

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Parsing Request Body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rate Limiting Config
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 contact messages per IP per window
  message: { message: 'Too many messages sent from this IP. Please try again after 15 minutes.' }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Max 15 login attempts per window
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' }
});

// Route Mounts
app.use('/api/auth', loginLimiter, authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactLimiter, contactRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/media', mediaRoutes);

// Base route indicator
app.get('/', (req, res) => {
  res.json({ status: 'healthy', message: 'MERN Portfolio API is running...' });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `API Route Not Found - ${req.originalUrl}` });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
