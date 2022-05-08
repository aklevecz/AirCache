export default {
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
