import "dotenv/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";

import httpStatusCode from "./utils/httpStatusCode.js";
import connectDatabase from "./config/database.js";
import { initializeSchedule } from "./scheduler/scheduler.js";

connectDatabase();
initializeSchedule();

import urlRouter from "./routes/urls.js";
import scrapeRouter from "./routes/scrape.js";
import authRouter from "./routes/auth/index.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
}));
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/urls", urlRouter);
app.use("/scrape", scrapeRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  next(createError(httpStatusCode.NOT_FOUND));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || httpStatusCode.INTERNAL_SERVER_ERROR);
});

export default app;
