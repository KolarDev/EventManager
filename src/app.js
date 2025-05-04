const path = require('path');
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// Security
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const helmet = require('helmet');
// Error Handling
const AppError = require('./utils/appError');
const errorHandler = require('./middlewares/errorHandler');

// Logging
const morgan = require('morgan');
const logger = require('./utils/logger');
//Documentation
const swaggerUi = require('swagger-ui-express');

// Passport configuration
require('./config/passport');

// Import Routes
const webhookRoutes = require('./routes/webhook');
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');
const ticketRoutes = require('./routes/ticket');
const cartRoutes = require('./routes/cart');
const favoritesRoutes = require('./routes/favorites');

const app = express();

//                                    MIDDLEWARES
// Cross-Origin Resource Sharing
app.use(cors());
// HTTP request logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const morganFormat = ':method :url :status :response-time ms';

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(' ')[0],
          url: message.split(' ')[1],
          status: message.split(' ')[2],
          responseTime: message.split(' ')[3],
        };
        logger.log('info', JSON.stringify(logObject));
      },
    },
  }),
);

// Set Security HTTP Headers
app.use(helmet());

// 1. Enable 'trust proxy'
app.set('trust proxy', 1);

// Limiting requests from same api
app.use(
  '/api',
  rateLimit({
    limit: 50,
    windowMs: 60 * 60 * 1000,
    message: 'IP requets exceed limit, Check back in an hour!',
    keyGenerator: (req, res) => req.ip, // Ensure it uses the real IP
  }),
);

// Middleware against NoSQL injection attacks
app.use(mongoSanitize());
// Middleware against cross-site (xss) attacks
app.use(xss());
// Prevent Parameter pollution
app.use(
  hpp({
    whitelist: [],
  }),
);

// Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(bodyparser.json());
app.use(cookieParser());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Session setup (for session-based auth)
// app.use(
//   session({
//     // secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// // Initialize Passport
// app.use(passport.initialize());
// app.use(passport.session());

// Generate API documentation using swagger
const swaggerFile = require('./swagger/swagger-output.json'); // Auto-generated API docs
// Swagger docs UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Event Manager Route!',
  });
});

// Routes
app.use('/api/v1/', webhookRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/carts', cartRoutes);
app.use('/api/v1/favorites', favoritesRoutes);

// When user enters undefined route
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

require('./utils/schedular');

// Global Error handling middleware
app.use(errorHandler);

module.exports = app;
