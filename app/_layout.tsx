import { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuthStore } from "../src/store/authStore";
import { getToken,getUser } from "../src/utils/storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const Layout = () => {
  const { setToken, token,setUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const hydrateToken = async () => {
      const storedToken = await getToken();
      const storedUser = await getUser();
      console.log("Stored Token",storedToken)
      console.log("Stored User",storedUser)
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser))
      } else {
        router.replace("(auth)/main");
      }
    };

    hydrateToken();
  }, []);

  return (
    
    <QueryClientProvider client={new QueryClient()}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {token ? (
            <>
              <Stack.Screen name="(tabs)/home" />
              <Stack.Screen name="(tabs)/profile" />
              <Stack.Screen name="(tabs)/upload" />
            </>
          ) : (
            <>
              <Stack.Screen name="(auth)/login" />
              <Stack.Screen name="(auth)/main" />
              <Stack.Screen name="(auth)/createAccount" />
            </>
          )}
        </Stack>
    </QueryClientProvider>

  );
};

export default Layout;
