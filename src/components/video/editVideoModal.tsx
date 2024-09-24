import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownComponent from "../ui/selector";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axiosInstance";

const EditVideoModal = ({ visible, onClose, video, onEdit }) => {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [category, setCategory] = useState(video.category);
  const [thumbnail, setThumbnail] = useState(video.thumbnail);
  const [categories, setCategories] = useState([]);

  // Fetch categories data
  const { data: categoryData, isLoading: isCategoriesLoading, refetch: refetchCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return (await axiosInstance.get("/category"))?.data;
    },
  });


  useEffect(() => {
    if (categoryData && categoryData.data) {
      const formattedCategories = categoryData.data.map((e) => ({
        label: e.title, 
        value: e.id,    
      }));
      setCategories(formattedCategories);
    }
  }, [categoryData]);

  // Submit the form
  const handleSubmit = () => {
    onEdit(video.id, { title, description, category, thumbnail });
    onClose();
  };

  // Pick new image for thumbnail
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);
    }
  };

  return (
    <Modal className=" bg-night" visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView className="flex-1 bg-night">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <ScrollView className="flex-1 p-4 mt-12">
            <Text className="text-2xl font-bold mb-4 text-white">Edit Video</Text>

            <Text className="font-semibold mb-2 text-white">Title</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-4 text-white"
              value={title}
              onChangeText={setTitle}
            />

            <Text className="font-semibold mb-2 text-white">Description</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-4 text-white"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />

            <Text className="font-semibold mb-2 text-white">Category</Text>
            {isCategoriesLoading ? (
              <Text>Loading Categories...</Text>
            ) : (
              <DropdownComponent handleChange={(val:string)=>{setCategory(val)}} data={categories} />
            )}

            <Text className="font-semibold mb-2 text-white mt-3">Thumbnail</Text>
            <TouchableOpacity
              className="  border-white border  p-2 rounded-md mb-4"
              onPress={pickImage}
            >
              <Text className=" text-white text-center">
                Choose New Thumbnail
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-end mt-4">
              <TouchableOpacity
                className="bg-gray-300 p-2 rounded-lg mr-2"
                onPress={onClose}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="border-springGreen border p-2 rounded-lg"
                onPress={handleSubmit}
              >
                <Text className="text-springGreen">Save Changes</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default EditVideoModal;
