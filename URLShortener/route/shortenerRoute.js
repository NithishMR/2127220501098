import express from "express";
import {
  shortenURL,
  getURLDetails,
} from "../controller/shortenerController.js";
const router = express.Router();
router.get("/:shortCode", getURLDetails);
router.post("/", shortenURL);
export default router;
