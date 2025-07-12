const START = 3;
const END = 10;
const generateLength = () => {
  const length = Math.random() * (END - START + 1) + START;
  return length;
};
const generateRandomURL = () => {
  const length = generateLength();
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let shortcode = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    shortcode += chars[randomIndex];
  }
  return shortcode;
};
export default generateRandomURL;
