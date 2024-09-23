import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";
import React from "react";
import { useAuthStore } from "../../src/store/authStore";
import { useLogin } from "../../src/api/auth";
import { useState } from "react";
import { router } from "expo-router";
import {storeToken} from "../../src/utils/storage"
const login = () => {
  const [formData, setFormData] = useState<{ email: string; password: string }>(
    { email: "", password: "" }
  );
  const { mutate, isPending, isError, error } = useLogin();
  const { setToken, setUser } = useAuthStore();
  const handleInputChange = (name: string, value) => {
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async () => {
    if (formData.email == "" || formData.password === "") {
      Alert.alert("Please fill all the details");
    }
    mutate(formData, {
      onSuccess: async (data: any) => {
        setToken(data.data?.token);
        setUser({ email: data.data?.user?.email, userName: data.data?.user?.userName,id:data.data?.user?.id });
        await storeToken(data.data?.token)
        router.replace("(tabs)/home");
      },
      onError: (error) => {
        Alert.alert('Error', 'Failed to Login. Please try again.');
        console.error('Account login error:', error);
      },
    });
  };
  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-2xl font-bold mb-6 text-center">
        Login
      </Text>

      <TextInput
        className="border p-4 mb-4 rounded"
        placeholder="Email"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
      />

      <TextInput
        className="border p-4 mb-6 rounded"
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
      />

      {isPending ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={handleSubmit} />
      )}

      <Text className="text-center mt-6">
        Don't have an account?{" "}
        <Text
          className="text-blue-600"
          onPress={() => router.replace("(auth)/createAccount")}
        >
          Create
        </Text>
      </Text>
    </View>
  );
};

export default login;
