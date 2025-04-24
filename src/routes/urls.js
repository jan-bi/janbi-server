import express from "express";
import { addUrl, getAllUrls, getUrlHistory } from "../controllers/urlController.js";
const router = express.Router();

router.post("/", addUrl);
router.get("/", getAllUrls);
router.get("/:id/history", getUrlHistory);

export default router;
