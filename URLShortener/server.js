import express, { json } from "express";
import shortener from "./route/shortenerRoute.js";

const app = express();
const PORT = 3000;
app.use(json());
const links = new Map();
const randomValues = new Set();
app.use("/shorturls", shortener);
app.listen(PORT, () => {
  console.log(`The http://localhost:${PORT}`);
});
