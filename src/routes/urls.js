import express from "express";
import { addUrl, getAllUrls, getUrlHistoryLogs } from "../controllers/urlController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { scrapeUrlById } from "../controllers/scrapeController.js";

const router = express.Router();

router.use(authenticate);

router.post("/", addUrl);
router.get("/", getAllUrls);
router.get("/:id/history", getUrlHistoryLogs);
router.post("/:id/scrape", scrapeUrlById);

export default router;
