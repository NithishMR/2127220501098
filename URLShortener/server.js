import express, { json } from "express";
import shortener from "./route/shortenerRoute.js";
import { logger } from "./middleware/logger.js";
const app = express();
const PORT = 3000;
app.use(json());
// app.use(logger);
app.use("/", shortener);
app.listen(PORT, () => {
  console.log(`The http://localhost:${PORT}`);
});
