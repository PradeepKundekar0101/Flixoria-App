import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useCreateAccount } from "../../src/api/auth";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../src/store/authStore";
import { storeToken } from "../../src/utils/storage";

const CreateAccount = () => {
  const { setToken, setUser } = useAuthStore();
  const router = useRouter();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });

  const { mutate, isPending } = useCreateAccount();

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!formData.userName || !formData.email || !formData.password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    mutate(formData, {
      onSuccess: async (data) => {
        setToken(data.token);
        setUser(data.user);
        await storeToken(data.data?.token);
        router.replace("(tabs)/home");
      },
      onError: (error) => {
        Alert.alert("Error", "Failed to create an account. Please try again.");
        console.error("Account creation error:", error);
      },
    });
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white">
      <Text className="text-2xl font-bold mb-6 text-center">
        Create Account
      </Text>

      <TextInput
        className="border p-4 mb-4 rounded"
        placeholder="Name"
        value={formData.userName}
        onChangeText={(value) => handleInputChange("userName", value)}
      />

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
        <Button title="Create Account" onPress={handleSubmit} />
      )}

      <Text className="text-center mt-6">
        Already have an account?{" "}
        <Text
          className="text-blue-600"
          onPress={() => router.replace("(auth)/login")}
        >
          Log In
        </Text>
      </Text>
    </View>
  );
};

export default CreateAccount;
