import "dotenv/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createError from "http-errors";
import passport from "passport";
import "./auth/passport.js";

import httpStatusCode from "./utils/httpStatusCode.js";
import connectDatabase from "./config/database.js";

connectDatabase();

import urlRouter from "./routes/urls.js";
import authRouter from "./routes/auth/index.js";
import userRouter from "./routes/user.js";

const app = express();

app.use(passport.initialize());

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map(origin => origin.trim()) || [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS 에러: 허용되지 않은 origin입니다."));
    }
  },
  credentials: true,
}));

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/urls", urlRouter);
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.status(httpStatusCode.OK).json({ message: "JANBI server is running" });
});

app.use((req, res, next) => {
  next(createError(httpStatusCode.NOT_FOUND));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || httpStatusCode.INTERNAL_SERVER_ERROR).json({
    message: err.message,
  });;
});

export default app;
