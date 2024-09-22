
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

const Index = () => {
  const { token } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (token) {
      router.replace('(tabs)/home'); 
    } else {
      router.replace('(auth)/index'); 
    }
  }, [token]);

  return null; 
};

export default Index;
