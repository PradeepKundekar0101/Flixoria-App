
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('token', token);
  } catch (error) {
    console.log('Error storing token:', error);
  }
};
export const storeUser = async (user: User) => {
  try {
    console.log("storing user")
    console.log(user)
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.log('Error storing user:', error);
  }
};

export const getUser = async () => {
  try {
    return await AsyncStorage.getItem('user');
  } catch (error) {
    console.log('Error retrieving user:', error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('token');
  } catch (error) {
    console.log('Error retrieving token:', error);
  }
};
