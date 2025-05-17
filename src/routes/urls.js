import express from "express";
import { addUrl, getAllUrls, getUrlHistory } from "../controllers/urlController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticate);

router.post("/", addUrl);
router.get("/", getAllUrls);
router.get("/:id/history", getUrlHistory);

export default router;
