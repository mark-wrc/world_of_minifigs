import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDatabase } from './config/dbConnect.js';

// IMPORT ROUTES
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// IMPORT MIDDLEWARE
import errorsMiddleware from './middlewares/errors.middleware.js';
import cookieParser from 'cookie-parser';

//FRONTEND FILE PATH
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config({ path: 'backend/config/config.env' });

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
	console.log(`Error: ${err}`);
	console.log('Shutting down due to uncaught exception');
	process.exit(1);
});

//Connect to Database
connectDatabase();

//Register express.json
//Handling Json
app.use(
	express.json({
		limit: '10mb',
		verify: (req, res, buf) => {
			req.rawBody = buf.toString();
		},
	})
);
app.use(cookieParser());

const allowedOrigins = [
	// temporary dev link for minifig builder site testing.
	// 'http://localhost:5173',
	// 'http://localhost:3000',

	// Production URLs
	'https://www.worldofminifigs.com', // Main production site
	'https://minifig-designer.onrender.com', // Minifig designer site

	// insert more allowed links here if needed
];

app.use(
	cors({
		origin: (origin, callback) => {
			// Allow requests with no origin (like mobile apps or curl requests)
			if (!origin) return callback(null, true);

			// In production, allow the main domain and related domains
			if (
				process.env.NODE_ENV === 'PRODUCTION' &&
				(origin.includes('worldofminifigs.com') ||
					origin.includes('world-of-minifigs'))
			) {
				return callback(null, true);
			}

			if (allowedOrigins.includes(origin)) {
				callback(null, true);
			} else {
				console.log(`CORS blocked origin: ${origin}`);
				callback(new Error('Not allowed by CORS.'));
			}
		},
		credentials: true,
	})
);

// Register Routes
app.use('/api/v1', userRoutes);
app.use('/api/v1', adminRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', reviewRoutes);
app.use('/api/v1', paymentRoutes);

// Register Middleware
app.use(errorsMiddleware);

if (process.env.NODE_ENV === 'PRODUCTION') {
	app.use(express.static(path.join(__dirname, '../frontend/dist')));

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'));
	});
}
const server = app.listen(process.env.PORT, () => {
	console.log(
		`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
	);
});

// HANDLE UNHANDLED PROMISE REJECTION
process.on('unhandledRejection', (err) => {
	console.log('Error:', err);
	console.log('Shutting down server due to unhandled promise Rejection');
	server.close(() => {
		process.exit(1);
	});
});

process.on('SIGTERM', () => {
	server.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
});

process.on('SIGINT', () => {
	server.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
});
