import "dotenv/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";

import httpStatusCode from "./utils/httpStatusCode.js";
import connectDatabase from "./config/database.js";

connectDatabase();

import indexRouter from "./routes/index.js";
import urlRouter from "./routes/urls.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/urls", urlRouter);

app.use((req, res, next) => {
  next(createError(httpStatusCode.NOT_FOUND));
});

app.use((err, req, res) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || httpStatusCode.INTERNAL_SERVER_ERROR);
});

export default app;
