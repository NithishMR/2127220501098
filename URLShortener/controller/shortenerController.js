import cache from "../cache/links.js";
import lru from "../utils/cache.js";
import generateRandomURL from "../utils/generateRandomUrl.js";
const shortCodeToUrl = new Map();
const urlToShortCode = new Map();
const randomValues = new Set();
export const shortenURL = (req, res) => {
  let { url, validity = 30, shortcode } = req.body;
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  if (urlToShortCode.has(url)) {
    return res
      .status(409)
      .json({ message: "This link has already been shortened" });
  }
  if (!shortcode) {
    shortcode = generateRandomURL();
    while (randomValues.has(shortcode)) {
      shortcode = generateRandomURL();
    }
    randomValues.add(shortcode);
    console.log(shortcode);
  }
  urlToShortCode.set(url, shortcode);
  shortCodeToUrl.set(shortcode, url);
  cache.push({
    url: url,
    shortcode: shortcode,
    totalClicks: 0,
    clicks: [],
    createdAt: new Date().toISOString(),
    validity: new Date(
      Date.now() + parseInt(validity) * 60 * 1000
    ).toISOString(),
    referrer: req.get("referer") || "direct",
    ip,
  });
  const result = {
    shortLink: `http://localhost:3000/${shortcode}`,
    validity: new Date(
      Date.now() + parseInt(validity) * 60 * 1000
    ).toISOString(),
  };
  console.log(cache);
  //toISOString
  res.status(201).json(result);
};
export const visitURL = (req, res) => {
  // console.log("the cache:", cache);
  const shortcode = req.params.shortcode;
  if (!shortcode) {
    return res.status(400).json({ message: "shortcode required" });
  }
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
  const referrer = req.get("referer") || "direct";
  const cached = lru.get(shortcode);
  if (cached) {
    console.log("LRU Cache Hit 🔥");
    cached.clicks.push({
      timestamp: new Date().toISOString(),
      ip,
      referrer,
    });
    cached.totalClicks = cached.clicks.length;

    return res.redirect(cached.url);
  }
  console.log("The short code:", shortcode);
  const link = cache.find((link) => link.shortcode === shortcode);
  console.log(link);
  if (!link) {
    return res.status(404).json({ error: "Shortcode not found" });
  }
  if (new Date(link.validity) < new Date()) {
    return res.status(410).json({ error: "Short URL has expired" });
  }
  lru.set(shortcode, link);

  link.clicks.push({
    timestamp: new Date().toISOString(),
    ip,
    referrer,
  });
  link.totalClicks = link.clicks.length;

  return res.redirect(link.url);
};
export const getURLDetails = (req, res) => {
  const shortcode = req.params.shortcode;
  const link = cache.find((link) => link.shortcode === shortcode);
  if (!link) {
    return res.status(404).json({ error: "Shortcode not found" });
  }
  const result = {
    url: link.url,
    shortcode: link.shortcode,
    createdAt: link.createdAt,
    validity: link.validity,
    totalClicks: link.totalClicks,
    clicks: link.clicks,
  };
  return res.status(200).json(result);
};
