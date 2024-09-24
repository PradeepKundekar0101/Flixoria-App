import { useEffect, useState } from "react";
import { Slot, useRouter } from "expo-router";
import { useAuthStore } from "../src/store/authStore";
import { getToken, getUser } from "../src/utils/storage";
import { LogBox } from 'react-native';
console.warn = () => {};

LogBox.ignoreLogs([]); 

const Index = () => {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const { setToken, token, setUser, loadTokenFromStorage } = useAuthStore();

  useEffect(() => {
    const hydrateAuthState = async () => {
      await loadTokenFromStorage();
      const [storedToken, storedUser] = await Promise.all([
        getToken(),
        getUser(),
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        router.replace("(auth)/main");
      }

      setIsReady(true);
    };

    hydrateAuthState();
  }, []);

  useEffect(() => {
    if (isReady) {
      if (token) {
        router.push("(tabs)/home");
      } else {
        router.replace("(auth)/main");
      }
    }
  }, [isReady, token]);

  return <Slot />;
};

export default Index;
