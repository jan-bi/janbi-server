import express from "express";
import { getStaticHtml } from "../controllers/scrapeController.js";

const router = express.Router();

router.post("/", getStaticHtml);

export default router;
