const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
// Security
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const helmet = require("helmet");
// Logging
const morgan = require("morgan");
//const logger = require("./logger");

// Error Handling
// const errorHandler = require("./src/middlewares/errorHandler");
// const AppError = require("./src/utils/appError");

// Routes
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const eventRoutes = require("./routes/event");

const app = express();

//                                    MIDDLEWARES
// Cross-Origin Resource Sharing
app.use(cors());
// HTTP request logger
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const morganFormat = ":method :url :status :response-time ms";

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

// // Develeopment logging
// if ((process.env.NODE_ENV = 'development')) {
//   app.use(morgan('dev'));
// }

// Set Security HTTP Headers
app.use(helmet());

// Limiting requests from same api
app.use(
  "/api",
  rateLimit({
    limit: 50,
    windowMs: 60 * 60 * 1000,
    message: "IP requets exceed limit, Check back in an hour!",
  })
);

// Middleware against NoSQL injection attacks
app.use(mongoSanitize());
// Middleware against cross-site (xss) attacks
app.use(xss());
// Prevent Parameter pollution
app.use(
  hpp({
    whitelist: [],
  })
);

// Parsers
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(bodyparser.json());
app.use(cookieParser());
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the Event Manager Route!",
  });
});

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", eventRoutes);

// When user enters undefined route
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error handling middleware
// app.use(errorHandler);

module.exports = app;
