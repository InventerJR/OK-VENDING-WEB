// localStorageWrapper.ts
export const localStorageWrapper = {
  getItem: (key: string) => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string) => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.setItem(key, value);
  },
  removeItem: (key: string) => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.removeItem(key);
  },
  clear: () => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.clear();
  }
};
