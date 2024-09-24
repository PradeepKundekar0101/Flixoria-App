import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react-native";
import axiosInstance from "../../../src/api/axiosInstance";
import VideoItemSm from "../../../src/components/video/videoItem-sm";
import {
  videoSkeleton,
  skeletonVideosItemSM,
} from "../../../src/components/video/skeletonVideosItemSM";
const SingleCategory = () => {
  const { id,title } = useLocalSearchParams();

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

  const renderVideoItem = ({ item }) => (
    <VideoItemSm
      self={false}
      item={item}
      onDelete={undefined}
      onEdit={undefined}
    />
  );

  const SkeletonLoader = () =><>
  <View className=" bg-night pt-10"></View>
  {skeletonVideosItemSM()}
  </> 

  if (isVideoLoading) return <SkeletonLoader />;

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error loading video</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1  bg-night">
      <TouchableOpacity
        className="flex-row items-center p-4"
        onPress={() => router.back()}
      >
        <ChevronLeft />
        <Text className="ml-2 font-semibold text-white">Back</Text>
      </TouchableOpacity>

      <View className="px-4">
        <Text className="text-lg font-semibold mb-4 text-springGreen">
          {title}
        </Text>
        {isVideoLoading ? (
          <SkeletonLoader />
        ) : (
          <FlatList
            data={videoData || []}
            ListEmptyComponent={
              <View className=" items-center justify-center flex-1">
                <Text className="text-slate-300 mb-1 text-lg">No Videos</Text>
                <Text className="text-slate-400 mb-1 text-lg">Be the first one to upload</Text>
                <TouchableOpacity onPress={()=>{router.push("upload")}} className=" border-springGreen border rounded-md px-3 py-1 text-lg">
                  <Text className="text-springGreen text-lg">Upload</Text>
                </TouchableOpacity>
              </View>
            }
            renderItem={renderVideoItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default SingleCategory;
