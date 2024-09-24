import { Stack } from "expo-router";
import { useAuthStore } from "../src/store/authStore";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import "../index.css";
import { StatusBar } from "react-native";

const queryClient = new QueryClient();

const Layout = () => {
  const { token } = useAuthStore();
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar barStyle="light-content" backgroundColor={"black"} />
      <SafeAreaView style={{ flex: 1 }}>
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
      </SafeAreaView>
    </QueryClientProvider>
  );
};

export default Layout;
