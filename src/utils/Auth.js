const TOKEN = "token";
const USER = "userData";
import { localStorageWrapper } from '@/utils/localStorageWrapper';


export const setAPIToken = (token, user) => {
  try {
    localStorageWrapper.setItem(TOKEN, token);
    localStorageWrapper.setItem(USER, JSON.stringify(user));
    return;
  } catch (error) {
    console.error("Error setting API token:", error);
    return null;
  }
};

export const getAPIToken = () => {
  try {
    const token = localStorageWrapper.getItem(TOKEN);
    const user = localStorageWrapper.getItem(USER) ? JSON.parse(localStorageWrapper.getItem(USER)) : null;
    return [token, user];
  } catch (error) {
    console.error("Error getting API token:", error);
    return [null, null];
  }
};

export const removeAPIToken = () => {
  try {
    localStorageWrapper.removeItem(TOKEN);
    localStorageWrapper.removeItem(USER);
    return;
  } catch (error) {
    console.error("Error removing API token:", error);
    return null;
  }
};
