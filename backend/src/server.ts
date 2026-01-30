import express from "express";
import type { ErrorRequestHandler } from "express";
import cors from "cors";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import { Db } from "./db.js";
import { authRouter } from "./routes/auth.routes.js";
import { gameRouter } from "./routes/game.routes.js";
import { guideRouter } from "./routes/guide.routes.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "../images")));

const db = new Db();
await db.initDB();

app.use("/auth", authRouter);
app.use("/games", gameRouter);
app.use("/guides", guideRouter);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message ?? "Unknown server error" });
};
app.use(errorHandler);

app.listen(PORT, () =>
  console.log(`Backend läuft auf http://localhost:${PORT}`),
);
