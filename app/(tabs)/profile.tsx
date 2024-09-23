import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import React from 'react';
import { useAuthStore } from '../../src/store/authStore';
import skeletonVideosItemSM, { videoSkeleton } from '../../src/components/video/skeletonVideosItemSM';
import VideoItemSm from '../../src/components/video/videoItem-sm';
import axiosInstance from '../../src/api/axiosInstance';
import { useQuery, useMutation } from '@tanstack/react-query';

const Home = () => {
  const { clearAuth, user } = useAuthStore();
  console.log("user", user);

  const {
    data: videoData,
    isLoading: isVideoLoading,
    error,
    refetch
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
    mutationFn: ({ videoId, updates }:any) => axiosInstance.put(`/video/${videoId}`, updates),
    onSuccess: () => {
      refetch();
    },
  });

  const handleDelete = (videoId) => {
    Alert.alert(
      "Delete Video",
      "Are you sure you want to delete this video?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteVideoMutation.mutate(videoId) }
      ]
    );
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
    <View className='flex-1'>
      <Text className='text-xl'>Hello {user?.userName} 👋</Text>
      <TouchableOpacity className='bg-red-500 text-red-800 w-fit p-2 rounded-lg mb-4' onPress={clearAuth}>
        <Text className='text-white'>Logout</Text>
      </TouchableOpacity>
      <View className="px-4 flex-1">
        <Text className="text-lg font-semibold mb-4">Your uploads</Text>
        {videos.length > 0 ? (
          <FlatList
            data={videos}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <Text>No videos uploaded yet.</Text>
        )}
      </View>
    </View>
  );
};

export default Home;