import express from "express";
import passport from "passport";
import "../../auth/passport.js";
import { handleGoogleCallback } from "../controllers/authController.js";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false }), handleGoogleCallback);

export default router;
