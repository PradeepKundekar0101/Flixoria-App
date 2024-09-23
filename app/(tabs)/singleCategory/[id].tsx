import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react-native";
import axiosInstance from "../../../src/api/axiosInstance";
import VideoItemSm from "../../../src/components/video/videoItem-sm";
import {videoSkeleton,skeletonVideosItemSM} from "../../../src/components/video/skeletonVideosItemSM"
const SingleCategory = () => {
  const { id } = useLocalSearchParams();
  const {
    data: videoData,
    isLoading: isVideoLoading,
    error,
  } = useQuery({
    queryKey: ["videos", id],
    queryFn: async () =>
      (await axiosInstance.get("/video/category/" + id)).data.data,
    enabled: !!id,
  });

  const renderVideoItem = ({ item }) => <VideoItemSm self={false} item={item} onDelete={undefined} onEdit={undefined} />;

  const SkeletonLoader = () => (
    <>
    {skeletonVideosItemSM()}

    </>
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

      <View className="px-4">
        <Text className="text-lg font-semibold mb-4">Categories</Text>
        {isVideoLoading ? (
          <SkeletonLoader />
        ) : (
          <FlatList
            data={videoData || []}
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

export default SingleCategory;
