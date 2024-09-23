import { useEffect, useState } from 'react';
import {  Slot, useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

const Index = () => {
  const { token, loadTokenFromStorage } = useAuthStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await loadTokenFromStorage(); 
      setIsReady(true);
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (isReady) {
      if (token) {
        router.push("(tabs)/home");  
      } else {
        router.replace('(auth)/login');  
      }
    }
  }, [isReady, token]);

  return <Slot />;
};

export default Index;
