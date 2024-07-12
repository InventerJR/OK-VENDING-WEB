const TOKEN = "token";
const USER = "userData";

export const setAPIToken = (token, user) => {
  try {
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(USER, JSON.stringify(user));
    return;
  } catch (error) {
    console.error("Error setting API token:", error);
    return null;
  }
};

export const getAPIToken = () => {
  try {
    const token = localStorage.getItem(TOKEN);
    const user = localStorage.getItem(USER) ? JSON.parse(localStorage.getItem(USER)) : null;
    return [token, user];
  } catch (error) {
    console.error("Error getting API token:", error);
    return [null, null];
  }
};

export const removeAPIToken = () => {
  try {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
    return;
  } catch (error) {
    console.error("Error removing API token:", error);
    return null;
  }
};
