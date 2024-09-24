import { View, Text } from "react-native";
import React from "react";

export const skeletonVideosItemSM = () => {
  return (
    <View className="flex-1 space-y-4 p-4 bg-night">
      {[...Array(3)].map((_, index) => (
        <View key={index} className="flex-row space-x-3">
          <View className="w-1/3 h-24 bg-gray-700 rounded-lg" />
          <View className="flex-1 space-y-2">
            <View className="w-3/4 h-4 bg-gray-700 rounded" />
            <View className="w-1/2 h-4 bg-gray-700 rounded" />
          </View>
        </View>
      ))}
    </View>
  );
};
export const videoSkeleton = () => {
  return (
    <View className="flex-1 space-y-4 p-4">
      <View className="w-full h-64 bg-gray-700 rounded-lg" />
      <View className="w-3/4 h-6 bg-gray-700 rounded" />
      <View className="w-1/2 h-4 bg-gray-700 rounded" />
      <View className="w-full h-20 bg-gray-700 rounded" />
    </View>
  );
};

export default skeletonVideosItemSM;
