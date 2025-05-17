import express from "express";
import googleAuthRouter from "./googleAuth.js";
import slackAuthRouter from "./slackAuth.js";
import tokenRouter from "./token.js";

const router = express.Router();

router.use("/google", googleAuthRouter);
router.use("/slack", slackAuthRouter);
router.use("/", tokenRouter);

export default router;
