const storage = {
  async getItem(key: string) {
    return globalThis.localStorage.getItem(key);
  },
  async setItem(key: string, value: string) {
    globalThis.localStorage.setItem(key, value);
  },
};

export default storage;
