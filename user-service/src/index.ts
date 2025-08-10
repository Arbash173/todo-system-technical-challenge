import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/userRoutes';
import { connectDatabase } from './config/database';

/**
 * Express application for the User Service
 * This service handles user registration, authentication, and JWT token generation
 */
const app = express();

/**
 * Server port configuration
 * Uses environment variable PORT or defaults to 3001
 */
const PORT = process.env.PORT || 3001;

/**
 * Security middleware configuration
 * - helmet: Sets various HTTP headers for security
 * - cors: Enables Cross-Origin Resource Sharing
 */
app.use(helmet());
app.use(cors());

/**
 * Rate limiting configuration
 * Limits each IP address to 100 requests per 15-minute window
 * Helps prevent abuse and DDoS attacks
 */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

/**
 * Body parsing middleware
 * - JSON parsing with 10MB limit to prevent large payload attacks
 * - URL-encoded form data support
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * API Routes
 * All user-related endpoints are prefixed with /api/users
 */
app.use('/api/users', userRoutes);

/**
 * Health check endpoint
 * Used by load balancers and monitoring systems to verify service status
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'user-service' });
});

/**
 * Global error handling middleware
 * Catches any unhandled errors and returns a generic 500 response
 * This should be the last middleware in the stack
 */
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

/**
 * Server startup function
 * Establishes database connection before starting the HTTP server
 * Exits process with code 1 if database connection fails
 */
const startServer = async () => {
  try {
    // Connect to PostgreSQL database
    await connectDatabase();
    
    // Start HTTP server on specified port
    app.listen(PORT, () => {
      console.log(`User service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Initialize the server
startServer();

export default app;