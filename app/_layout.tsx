import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';
import { getToken } from '../src/utils/storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const Layout = () => {
  const { setToken, token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const hydrateToken = async () => {
      const storedToken = await getToken();
      if (storedToken) {
        setToken(storedToken); 
      } else {
        router.replace('(auth)/main'); 
      }
    };

    hydrateToken();
  }, []);

  return (
    <QueryClientProvider client={new QueryClient}>
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
            <Stack.Screen name="(auth)/createAccount" />
          </>
        )}
      </Stack>
    </QueryClientProvider>
  );
};

export default Layout;
