import express from "express";
import { addUrl, getUrlHistory } from "../controllers/urlController.js";
const router = express.Router();

router.post("/", addUrl);
router.get("/:id/history", getUrlHistory);

export default router;
