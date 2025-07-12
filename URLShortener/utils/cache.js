import { LRUCache } from "lru-cache";

const options = {
  max: 100, // Max 100 items in cache
  ttl: 1000 * 60 * 30, // Time-to-live = 30 mins
};

const lru = new LRUCache(options);

export default lru;
