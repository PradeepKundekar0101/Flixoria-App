import { View, Text, Button } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const Index = () => {
  const router = useRouter();

  const navigateToLogin = () => {
    router.push('(auth)/login');
  };

  const navigateToCreateAccount = () => {
    router.push('(auth)/createAccount');
  };

  return (
    <View className="h-screen flex items-center justify-center">
      <Text>Welcome</Text>
      
      <View style={{ marginTop: 20 }}>
        <Button title="Login" onPress={navigateToLogin} />
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Create Account" onPress={navigateToCreateAccount} />
      </View>
    </View>
  );
};

export default Index;
