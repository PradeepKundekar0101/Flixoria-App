
import axiosInstance from "./axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";

export const useLogin = () => {
  const { setToken, setUser } = useAuthStore();

  return useMutation({
    mutationKey: [""],
    mutationFn: async (loginData: { email: string; password: string }) => {
      const response = await axiosInstance.post("/user/login", loginData);
      return response.data;
    },
    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
    },
    onError: (error) => {
      console.log("Login error:", error);
    },
  });
};

export const useCreateAccount = () => {
  const { setToken, setUser } = useAuthStore();
  return useMutation({
    mutationKey: ["createAccount"],
    mutationFn: async (accountData: {
      email: string;
      password: string;
      userName: string;
    }) => {
      const response = await axiosInstance.post(
        "/user/createUser",
        accountData
      );
      return response.data;
    },

    onSuccess: (data) => {
      setToken(data.token);
      setUser(data.user);
    },
    onError: (error) => {
      console.log("Account creation error:", error);
    },
  });
};
