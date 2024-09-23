import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { useVideoUpload } from '../../src/api/video';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../src/api/axiosInstance';
import SelectDropdown from "react-native-select-dropdown";



const Upload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [video, setVideo] = useState(null);
  const [categorySelected, setCategorySelected] = useState('');

  const { uploadVideo, uploadStatus, isUploading } = useVideoUpload();

  const { data: categoriesData, isLoading: isCategoriesLoading ,isError:isCategoriesError} = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      return await axiosInstance.get('/category');
    },
  });

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
      aspect: [1, 1]
    });
    if (!result.canceled) {
      setThumbnail(result.assets[0]);
    }
  };

  const handleUpload = async () => {
    if (!video) {
      Alert.alert('Please select a video');
      return;
    }

    if (!categorySelected) {
      Alert.alert('Please select a category');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('categoryId', categorySelected);
    formData.append('fileExtension', video.uri.split('.').pop());
    formData.append('fileType', video.type);

    if (thumbnail) {
      const imageUri = thumbnail.uri;
      const imageName = imageUri.split('/').pop();
      const imageType = 'image/' + imageName.split('.').pop();

      formData.append('image', {
        uri: imageUri,
        name: imageName,
        type: imageType,
      } as any);
    }

    uploadVideo({ formData, videoUri: video.uri });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Video</Text>

      <TextInput
        style={styles.input}
        onChangeText={setTitle}
        value={title}
        placeholder="Video Title"
      />

      <TextInput
        style={[styles.input, styles.textArea]}
        onChangeText={setDescription}
        value={description}
        placeholder="Video Description"
        multiline
      />

      <TouchableOpacity onPress={pickVideo} style={styles.button}>
        <Text>{video ? 'Change Video' : 'Select Video'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={pickThumbnail} style={styles.button}>
        <Text>{thumbnail ? 'Change Thumbnail' : 'Select Thumbnail'}</Text>
      </TouchableOpacity>

      {thumbnail && (
        <Image
          source={{ uri: thumbnail.uri }}
          style={{ width: '100%', height: 200, marginBottom: 10 }}
        />
      )}

{isCategoriesLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : isCategoriesError ? (
        <Text>Error loading categories</Text>
      ) : (
        <SelectDropdown
          data={categoriesData?.data?.data}
          onSelect={(selectedItem) => {
            setCategorySelected(selectedItem?.id);
          }}
          renderButton={(selectedItem, isOpened) => {
            return (
              <View style={styles.dropdownButtonStyle}>
                <Text style={styles.dropdownButtonTxtStyle}>
                  {(selectedItem && selectedItem.title) || "Select category"}
                </Text>
              </View>
            );
          }}
          renderItem={(item, index, isSelected) => {
            return (
              <View
                style={{
                  ...styles.dropdownItemStyle,
                  ...(isSelected && { backgroundColor: "#D2D9DF" }),
                }}
              >
                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
              </View>
            );
          }}
          showsVerticalScrollIndicator={false}
          dropdownStyle={styles.dropdownMenuStyle}
        />
      )}


      <TouchableOpacity
        onPress={handleUpload}
        style={[styles.button, styles.uploadButton]}
        disabled={isUploading}
      >
        <Text style={styles.uploadButtonText}>
          {isUploading ? `${uploadStatus.status} (${uploadStatus.progress}%)` : 'Upload Video'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  textArea: {
    height: 80,
  },
  button: {
    backgroundColor: '#ddd',
    padding: 10,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
  },
  uploadButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  categoryText: {
    fontSize: 18,
    marginVertical: 5,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  dropdownButtonStyle: {
    width: 200,
    height: 50,
    backgroundColor: "#E9ECEF",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  dropdownButtonTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownButtonArrowStyle: {
    fontSize: 28,
  },
  dropdownButtonIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
  dropdownMenuStyle: {
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
  },
  dropdownItemStyle: {
    width: "100%",
    flexDirection: "row",
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  dropdownItemTxtStyle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "500",
    color: "#151E26",
  },
  dropdownItemIconStyle: {
    fontSize: 28,
    marginRight: 8,
  },
});

export default Upload;