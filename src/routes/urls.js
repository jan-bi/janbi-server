import express from "express";
import { addUrl } from "../controllers/urlController.js";
const router = express.Router();

router.post("/", addUrl);

export default router;
