import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

const Index = () => {
  const { token } = useAuthStore();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) {
      if (token) {
        router.push("(tabs)/home");  // Ensure it routes correctly to home
      } else {
        router.replace('(auth)/login');  // Ensure it goes to login screen
      }
    }
  }, [isReady, token]);

  return null; 
};

export default Index;
