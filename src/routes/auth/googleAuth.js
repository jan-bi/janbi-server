import express from "express";
import passport from "passport";
import "../../auth/passport.js";
import { handleGoogleCallback } from "../../controllers/authController.js";

const router = express.Router();

router.get("/", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/callback", passport.authenticate("google", { session: false }), handleGoogleCallback);

export default router;
