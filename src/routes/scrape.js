import express from "express";
import { getPageHtml } from "../controllers/scrapeController.js";

const router = express.Router();

router.post("/", getPageHtml);

export default router;
