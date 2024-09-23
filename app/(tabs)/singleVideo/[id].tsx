import React, { useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, FlatList, Image, Dimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Play, User, ChevronLeft, Eye, Clock } from "lucide-react-native";
import axiosInstance from "../../../src/api/axiosInstance";
import { Video } from "expo-av";
import moment from "moment";
import VideoItemSm from "../../../src/components/video/videoItem-sm";

const { width } = Dimensions.get("window");

const SingleVideo = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { id } = useLocalSearchParams();
    
  const { data: videoData, isLoading: isVideoLoading, error } = useQuery({
    queryKey: ["video", id],
    queryFn: async () => (await axiosInstance.get("/video/" + id)).data?.data,
    enabled: !!id,
  });

  const { data: relatedVideos, isLoading: isRelatedVideosLoading } = useQuery({
    queryKey: ["related_video", videoData?.categoryId],
    queryFn: async () => (await axiosInstance.get("/video/category/" + videoData.categoryId)).data?.data,
    enabled: !!videoData?.categoryId,
  });

  const renderVideoItem = ({ item }) => (
   <VideoItemSm item={item}/>
  );

  const SkeletonLoader = () => (
    <View className="flex-1 space-y-4 p-4">
      <View className="w-full h-64 bg-gray-300 rounded-lg" />
      <View className="w-3/4 h-6 bg-gray-300 rounded" />
      <View className="w-1/2 h-4 bg-gray-300 rounded" />
      <View className="w-full h-20 bg-gray-300 rounded" />
      {[...Array(3)].map((_, index) => (
        <View key={index} className="flex-row space-x-3">
          <View className="w-1/3 h-24 bg-gray-300 rounded-lg" />
          <View className="flex-1 space-y-2">
            <View className="w-3/4 h-4 bg-gray-300 rounded" />
            <View className="w-1/2 h-4 bg-gray-300 rounded" />
          </View>
        </View>
      ))}
    </View>
  );

  if (isVideoLoading) return <SkeletonLoader />;

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading video</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <TouchableOpacity
        className="flex-row items-center p-4"
        onPress={() => router.back()}
      >
        <ChevronLeft />
        <Text className="ml-2 font-semibold">Back</Text>
      </TouchableOpacity>
     
      <Video
        source={{ uri: videoData.url }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        useNativeControls
        shouldPlay
        style={{ width: width, height: width * 9/16 }}
        // resizeMode="cover"
      />

      <View className="p-4">
        <Text className="text-2xl font-bold mb-2">{videoData?.title}</Text>
        
        <View className="flex-row items-center mb-4">
          <User size={20} color="#666" />
          <Text className="ml-2 font-semibold">{videoData?.user?.name || "Unknown User"}</Text>
          <View className="flex-row items-center ml-4">
            <Eye size={16} color="#666" />
            <Text className="ml-1 text-sm text-gray-500">{videoData?.views || 0} views</Text>
          </View>
        </View>

        <Text numberOfLines={showFullDescription ? undefined : 3}>
          {videoData.description}
        </Text>
        {videoData.description.length > 100 && (
          <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text className="text-blue-500 mt-2">
              {showFullDescription ? "Read Less" : "Read More"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="px-4">
        <Text className="text-lg font-semibold mb-4">Related Videos</Text>
        {isRelatedVideosLoading ? (
          <SkeletonLoader />
        ) : (
          <FlatList
            data={relatedVideos || []}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default SingleVideo;