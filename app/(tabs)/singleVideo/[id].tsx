import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, FlatList, Image, Dimensions } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Play, User, ChevronLeft, Eye, Clock } from "lucide-react-native";
import axiosInstance from "../../../src/api/axiosInstance";
import { Video } from "expo-av";
import { videoSkeleton } from "../../../src/components/video/skeletonVideosItemSM";
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
  console.log(videoData)
  const { data: relatedVideos, isLoading: isRelatedVideosLoading } = useQuery({
    queryKey: ["related_video", videoData?.categoryId],
    queryFn: async () => (await axiosInstance.get("/video/category/" + videoData.categoryId)).data?.data,
    enabled: !!videoData?.categoryId,
  });

  // Increase view mutation
  const { mutate: increaseView } = useMutation({
    mutationKey: ["increaseView", id],
    mutationFn: async (videoId) => {
      await axiosInstance.post("/video/videoView", { videoId });
    },
  });

  // Trigger increase view when the videoData is loaded and video starts playing
  useEffect(() => {
    if (videoData?.id) {
      increaseView(videoData.id); // Call API to increase view count
    }
  }, [videoData]);

  const renderVideoItem = ({ item }) => (
    <VideoItemSm item={item} self={undefined} onDelete={undefined} onEdit={undefined} />
  );

  if (isVideoLoading) return videoSkeleton;

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading video</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-night">
      <TouchableOpacity className="flex-row items-center p-4" onPress={() => router.back()}>
        <ChevronLeft />
        <Text className="ml-2 font-semibold text-slate-400">Back</Text>
      </TouchableOpacity>

      <Video
        source={{ uri: videoData.url }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        useNativeControls
        shouldPlay
        style={{ width: width, height: width * (9 / 16) }}
      />

      <View className="p-4">
        <Text className="text-2xl font-bold mb-2 text-slate-200">{videoData?.title}</Text>

        <View className="flex-row items-center mb-4">
          <User size={20} color="#666" />
          <Text className="ml-2 font-semibold text-slate-300">{videoData?.user?.userName || "Unknown User"}</Text>
          <View className="flex-row items-center ml-4">
            <Eye size={16} color="#666" />
            <Text className="ml-1 text-sm text-slate-300">{videoData?.views || 0} views</Text>
          </View>
        </View>

        <Text className="text-slate-300" numberOfLines={showFullDescription ? undefined : 3}>
          {videoData.description}
        </Text>
        {videoData.description.length > 100 && (
          <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text className="text-blue-500 mt-2">{showFullDescription ? "Read Less" : "Read More"}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="px-4">
        <Text className="text-lg font-semibold mb-4 text-slate-300">Related Videos</Text>
        {isRelatedVideosLoading ? (
          videoSkeleton()
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
