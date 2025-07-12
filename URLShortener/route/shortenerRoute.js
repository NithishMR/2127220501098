import express from "express";
import {
  getURLDetails,
  shortenURL,
  visitURL,
} from "../controller/shortenerController.js";
const router = express.Router();
router.get("/:shortcode", visitURL);
router.post("/shorturls/", shortenURL);
router.get("/shorturls/:shortcode", getURLDetails);
export default router;
