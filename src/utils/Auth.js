/*
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN = "token";
const USER = "userData";

export const setAPIToken = async (token, user) => {
  try {
    await Promise.all([
      AsyncStorage.setItem(TOKEN, token),
      AsyncStorage.setItem(USER, JSON.stringify(user)),
    ]);
    return;
  } catch (error) {
    return null;
  }
};

export const getAPIToken = async () => {
  try {
    const [token, user] = await Promise.all([
      AsyncStorage.getItem(TOKEN),
      AsyncStorage.getItem(USER),
    ]);
    return [token, JSON.parse(user)];
  } catch (error) {
    return null;
  }
};

export const removeAPIToken = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN),
      AsyncStorage.removeItem(USER),
    ]);
    return;
  } catch (error) {
    return null;
  }
};
*/