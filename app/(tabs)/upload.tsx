import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
// import { useNavigation } from "@react-navigation/native";

import { useVideoUpload } from "../../src/api/video";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../src/api/axiosInstance";

import { FileImageIcon, FileVideoIcon } from "lucide-react-native";
import DropdownComponent from "../../src/components/ui/selector";
import UploadStatusIndicator from "../../src/components/ui/statusIndicator";
import { router } from "expo-router";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [categorySelected, setCategorySelected] = useState("");
  const [categories, setCategories] = useState([]);



  const { uploadVideo, uploadStatus, isUploading } = useVideoUpload();

  const {
    data: categoriesData,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return (await axiosInstance.get("/category")).data;
    },
  });

  useEffect(() => {
    if (categoriesData && categoriesData.data) {
      const formattedCategories = categoriesData.data.map((e) => ({
        label: e.title, 
        value: e.id, 
      }));
      setCategories(formattedCategories);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (uploadStatus.status === 'completed') {
      Alert.alert(
        "Upload Successful",
        "Your video has been uploaded successfully!",
        [
          { text: "OK", onPress: () => router.push("(tabs)/profile") }
        ]
      );
      clearFields();
    }
  }, [uploadStatus]);

  const clearFields = () => {
    setTitle("");
    setDescription("");
    setThumbnail(null);
    setVideo(null);
    setCategorySelected("");
  };

  const pickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setVideo(result.assets[0]);
    }
  };

  const pickThumbnail = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });
    if (!result.canceled) {
      setThumbnail(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (!video) {
      Alert.alert("Please select a video");
      return;
    }

    if (!categorySelected) {
      Alert.alert("Please select a category");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("categoryId", categorySelected);
    formData.append("fileExtension", video.uri.split(".").pop());
    formData.append("fileType", video.type);

    if (thumbnail) {
      const imageUri = thumbnail.uri;
      const imageName = imageUri.split("/").pop();
      const imageType = "image/" + imageName.split(".").pop();

      formData.append("image", {
        uri: imageUri,
        name: imageName,
        type: imageType,
      } as any);
    }

    uploadVideo({ formData, videoUri: video.uri });
  };

  return (
    <ScrollView className="bg-night px-4 pt-8 pb-2 h-full ">
      <Text className="text-springGreen" style={styles.title}>
        Upload Video
      </Text>

      {isUploading && <UploadStatusIndicator status={uploadStatus.status} />}

      <TextInput
        className="border border-darkStroke text-white placeholder:text-white px-3 py-2 text-lg rounded-md mb-2"
        onChangeText={setTitle}
        value={title}
        placeholder="Video Title"
        placeholderTextColor="gray"
        
      />

      <TextInput
        className="border border-darkStroke text-white placeholder:text-white px-3 py-2 text-lg rounded-md mb-2 h-28"
        placeholderTextColor="gray"
        onChangeText={setDescription}
        value={description}
        placeholder="Video Description"
        multiline
      />
      {isCategoriesLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : isCategoriesError ? (
        <Text>Error loading categories</Text>
      ) : (
        <View className="mb-2">
          <DropdownComponent handleChange={(value)=>{setCategorySelected(value)}} data={categories} />
        </View>
      )}

      <View className="border-darkStroke border h-28 flex items-center justify-center border-dotted mb-2">
        <TouchableOpacity
          className="bg-transparent flex items-center"
          onPress={pickVideo}
        >
          <Text className="text-lg text-gray-400 px-3">
            {video ? "Change Video" : "Select Video"}
          </Text>
          <FileVideoIcon color={"gray"} />
        </TouchableOpacity>
      </View>

      <View className="border-darkStroke border h-28 flex items-center justify-center border-dotted mb-3">
        <TouchableOpacity
          className="bg-transparent flex items-center"
          onPress={pickThumbnail}
        >
          <Text className="text-lg text-gray-400 px-3">
            {thumbnail ? "Change Thumbnail" : "Select Thumbnail"}
          </Text>
          <FileImageIcon color={"gray"} />
        </TouchableOpacity>
      </View>
      {thumbnail && (
        <Image
          source={{ uri: thumbnail.uri }}
          style={{ width: "100%", height: 200, marginBottom: 10 }}
        />
      )}

      <TouchableOpacity
        className="border-springGreen border-[1px] py-2 rounded-md mb-4"
        onPress={handleUpload}
        disabled={isUploading}
      >
        <Text className="text-springGreen text-center text-lg">
          {isUploading ? "Uploading..." : "Upload Video"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default Upload;