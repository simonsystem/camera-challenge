import dotenv from 'dotenv';
import routes from './routes';

// Load environment variable defaults from .env file
dotenv.config();

// Start and listen express routes
routes();