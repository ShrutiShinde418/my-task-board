import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

import { connectDB } from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverTimeout = process.env.TIMEOUT;

dotenv.config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
});

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.use(errorHandler);

const server = app.listen(process.env.PORT, async () => {
  await connectDB();

  console.log(`Server started on port ${process.env.PORT}`);
});

server.setTimeout(serverTimeout);

export default app;
