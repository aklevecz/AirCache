export default {
  keys: {
    token: "token",
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
