import express, { urlencoded } from "express";
import dotenv from "dotenv";
import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";

import connectDB from "./config/db.js";

// Routes
import testRouter from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import jobsRoute from "./routes/jobsRoute.js";

// Middlewares
import errorMiddleware from "./middlewares/errorMiddleware.js";
import sanitizeInput from "./middlewares/sanitizeInput.js";

dotenv.config();

const app = express();

// Connect DB
connectDB();

// Swagger Config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node express js Job Portal Application",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);

// Middleware
app.use(helmet());
app.use((req, res, next) => {
  const sanitizeOptions = { replaceWith: "_" }; // or any valid config
  if (req.body) mongoSanitize.sanitize(req.body, sanitizeOptions);
  if (req.query) mongoSanitize.sanitize(req.query, sanitizeOptions);
  if (req.params) mongoSanitize.sanitize(req.params, sanitizeOptions);
  next();
});

app.use(sanitizeInput); // Optional, if you have additional sanitization
app.use(urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/test", testRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoute);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

// Global Error Handler
app.use(errorMiddleware);

// Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(
    `Application is running in ${process.env.DEV_MODE} mode on port ${PORT}`
  );
});
