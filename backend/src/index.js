import express from "express";
import path from "node:path";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "node:url";
import { rateLimit } from "express-rate-limit";

import { connectDB } from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import boardRouter from "./routes/boardRouter.js";
import taskRouter from "./routes/taskRouter.js";
import authRouter from "./routes/authRouter.js";
import setupLogger from "./utils/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverTimeout = process.env.TIMEOUT;

dotenv.config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
});

global.logger = setupLogger(
  process.env.LOGGER_FILE_PATH,
  process.env.LOGGER_LEVEL,
);

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  legacyHeaders: false,
  ipv6Subnet: 52,
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);
app.use(helmet());
app.use(limiter);

app.use("/api", boardRouter);
app.use("/api", taskRouter);
app.use("/api", authRouter);

app.use(errorHandler);

const server = app.listen(process.env.PORT, async () => {
  await connectDB();

  console.log(`Server started on port ${process.env.PORT}`);
});

server.setTimeout(serverTimeout);

export default app;
