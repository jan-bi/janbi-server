import express from "express";
import { addUrl } from "../controllers/urlController";
const router = express.Router();

router.post("/", addUrl);

export default router;
