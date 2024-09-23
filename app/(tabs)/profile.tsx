import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useAuthStore } from "../../src/store/authStore";
import skeletonVideosItemSM, {
  videoSkeleton,
} from "../../src/components/video/skeletonVideosItemSM";
import VideoItemSm from "../../src/components/video/videoItem-sm";
import axiosInstance from "../../src/api/axiosInstance";
import { useQuery, useMutation } from "@tanstack/react-query";

import ProfilePicture from "../../src/components/ui/avatar";
import { MoreVertical } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const Home = () => {
  const { clearAuth, user } = useAuthStore();  const [menuVisible, setMenuVisible] = useState(false);

  console.log("user", user);
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: clearAuth },
    ]);
  };

  const {
    data: videoData,
    isLoading: isVideoLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["videos", user?.id],
    queryFn: async () => {
      const response = await axiosInstance.get("/video/user/" + user?.id);
      return response.data; // Assuming the API returns { data: [...] }
    },
    enabled: !!user?.id,
  });

  const deleteVideoMutation = useMutation({
    mutationFn: (videoId) => axiosInstance.delete(`/video/${videoId}`),
    onSuccess: () => {
      refetch();
    },
  });

  const editVideoMutation = useMutation({
    mutationFn: ({ videoId, updates }: any) =>
      axiosInstance.put(`/video/${videoId}`, updates),
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (videoId) => {
    Alert.alert("Delete Video", "Are you sure you want to delete this video?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => deleteVideoMutation.mutate(videoId),
      },
    ]);
  };

  const handleEdit = (videoId, updates) => {
    editVideoMutation.mutate({ videoId, updates });
  };

  const renderVideoItem = ({ item }) => (
    <VideoItemSm
      self={user?.id === item?.userId}
      item={item}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  );

  const SkeletonLoader = () => (
    <>
      {skeletonVideosItemSM()}
      {videoSkeleton()}
    </>
  );

  if (isVideoLoading) return <SkeletonLoader />;

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading videos</Text>
      </View>
    );
  }

  const videos = videoData?.data || [];

  return (
    <ScrollView className="flex-1 bg-night ">
      
      <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: -2 }}
      locations={[0, 0.7, 1]}
      colors={['#093971', '#13F287', '#5CA0DE']}
      className="flex-1 pt-8 pb-16 relative"
    >
        <View className="flex-row items-center justify-between">
        </View>
        </LinearGradient>

      <View className="-mt-8 px-4">
        <ProfilePicture userName={ user.userName} />
      </View>
    <View className=" flex flex-row justify-between px-4">

      <Text className="text-xl text-slate-300">
        Hello 
        <Text className=" text-springGreen text-2xl font-semibold">

          {" "+ user.userName.charAt(0).toUpperCase() +
            user?.userName.slice(1, user.userName.length)}
        </Text>
        👋
      </Text>
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <MoreVertical size={24} color="#fff" />
          </TouchableOpacity>
            </View>
            <View className=" flex flex-row px-4 space-x-1 my-2 ">
              <View className=" w-1/2 h-24 border-[#2b2b2b] border flex items-center justify-center rounded-md">
                <Text className=" text-white text-3xl"> 0 </Text>
                <Text className=" text-slate-300"> Views </Text>
              </View>
              <View className=" w-1/2 h-24 border-[#2b2b2b] border flex items-center justify-center rounded-md">
                <Text className=" text-white text-3xl"> 0 </Text>
                <Text className=" text-slate-300"> Videos </Text>
              </View>
            </View>
     
      <View className=" flex-1 px-4 mt-4">
        <Text className="text-lg font-semibold  text-slate-300">
          Your uploads
        </Text>

        <FlatList
          data={videos || []}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className=" items-start justify-start flex-1">
              <Text className="text-slate-300 mb-1 text-sm">No Videos</Text>
            </View>
          }
        />
      </View>
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View className="bg-white rounded-lg p-4 absolute right-4 top-1/4">
            <TouchableOpacity className="flex-row items-center py-2" onPress={handleLogout}>
              <Text className="ml-2 text-red-500">Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

export default Home;
