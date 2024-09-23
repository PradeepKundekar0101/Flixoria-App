import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Alert,
  Button,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useAuthStore } from "../../src/store/authStore";
import { useLogin } from "../../src/api/auth";
import { useState } from "react";
import { router } from "expo-router";
import {storeToken, storeUser} from "../../src/utils/storage"
import { LinearGradient } from "expo-linear-gradient";
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
        await storeUser(data.data?.user)
        router.replace("(tabs)/home");
      },
      onError: (error) => {
        Alert.alert('Error', 'Failed to Login. Please try again.');
        console.error('Account login error:', error);
      },
    });
  };
  return (
    <LinearGradient
    start={{ x: -1, y: -1 }}
    end={{ x: 0, y: 0 }}
    locations={[0, 0.7, 1]}
    colors={['#02783f', '#121212', '#121212']}
    className="flex-1"
  >
    <View className="flex-1 justify-center p-4">
      <Text className="text-2xl font-bold mb-6 text-center text-springGreen">
        Welcome back!
      </Text>

      <TextInput
        placeholder="Email"
        className=" border-[1.6px] border-darkStroke text-white  placeholder:text-white px-3 py-2 text-lg rounded-md  mb-2 "
        placeholderTextColor="gray"
        keyboardType="email-address"
        value={formData.email}
        onChangeText={(value) => handleInputChange("email", value)}
      />

      <TextInput
         className=" border-[1.6px] border-darkStroke text-white  placeholder:text-white px-3 py-2 text-lg rounded-md  mb-2 "
        placeholderTextColor="gray"
        placeholder="Password"
        secureTextEntry
        value={formData.password}
        onChangeText={(value) => handleInputChange("password", value)}
      />

      {isPending ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity 
        className="bg-transparent border-slate-400 border bg-opacity-20 py-2 px-8 rounded-md mb-4"

        onPress={handleSubmit}>
                     <Text className="text-slate-100 text-lg text-center">Login</Text>


        </TouchableOpacity> 
      )}

      <Text className="text-center mt-6 text-slate-200">
        Don't have an account?{" "}
        <Text
          className="text-blue-300"
          onPress={() => router.replace("(auth)/createAccount")}
        >
          Create one
        </Text>
      </Text>
    </View>
  </LinearGradient>
  );
};

export default login;
