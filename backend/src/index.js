import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import boardRouter from "./routes/boardRouter.js";
import taskRouter from "./routes/taskRouter.js";
import authRouter from "./routes/authRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverTimeout = process.env.TIMEOUT;

dotenv.config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
});

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());

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
