const storage = {
  keys: {
    version: "version",
    token: "token",
    user_location: "user_location",
    active_cache_contract_address: "active_cache_contract_address",
  },
  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  },
  getItem(key: string) {
    return localStorage.getItem(key);
  },
  deleteItem(key: string) {
    localStorage.removeItem(key);
  },
};

export default storage;

export const getCachedCaches = async (numCaches: number, address: string) => {
  const caches: any = { cached: [], new: [] };
  for (let i = 1; i <= numCaches; i++) {
    const cacheKey = `cache_${address}_${i}`;
    const cachedCache = storage.getItem(cacheKey);
    if (!cachedCache) {
      caches.new.push(i);
    } else {
      caches.cached.push({ ...JSON.parse(cachedCache), id: i, NFT: {} });
    }
  }
  return caches;
};
