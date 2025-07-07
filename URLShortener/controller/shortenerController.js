import cache from "../cache/links.js";
const links = new Map();
const randomValues = new Set();
export const shortenURL = (req, res) => {
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
  //toISOString
  res.status(201).json(result);
};
export const getURLDetails = (req, res) => {
  console.log(req.params);
  const shortcode = req.params.shortcode;
  const data = cache.find((link) => link.shortcode === shortcode);
  console.log("The data is :", data);
  res
    .status(200)
    .json({ message: "Details of the shortened url fetched successfully" });
};
