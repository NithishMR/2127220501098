import express, { json } from "express";
import cache from "./cache/links.js";
// import LRU from "lru-cache";
const app = express();
const PORT = 3000;
app.use(json());
// const cache = new LRU({
//   max: 100,
//   ttl: 1000 * 60 * 5,
// });
const links = new Map();
const randomValues = new Set();
app.post("/shorturls", (req, res) => {
  let { url, validity = 30, shortcode } = req.body;
  if (links.has(url)) {
    return res
      .status(500)
      .json({ message: "This link has already been shortened" });
  }
  if (!shortcode) {
    let code = parseInt(Math.random() * 1000);
    while (randomValues.has(code)) {
      code = parseInt(Math.random() * 1000);
    }
    randomValues.add(code);
    shortcode = "abcd" + code.toString();
    console.log(shortcode);
  }
  links.set(url, shortcode);
  cache.push({
    url: url,
    shortcode: shortcode,
    numberOfTimesClicked: 0,
    validity: validity,
  });
  const result = {
    shortLink: shortcode,
    timestamp: Date.now(),
  };
  res.status(201).json(result);
});
app.get("/shorturls/:shortcode", (req, res) => {
  console.log(req.params);
  const shortcode = req.params.shortcode;
  const data = cache.find((link) => link.shortcode === shortcode);
  console.log("The data is :", data);
  res.send("Okay");
});
app.get("/", (req, res) => {
  console.log(links);
  console.log(cache);
  res.send("This works");
});
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
