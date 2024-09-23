import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../src/api/axiosInstance";
import { Play, User } from "lucide-react-native";
import moment from "moment";
import { router } from "expo-router";
import CategoryItem from "../../src/components/video/categoryItem";
const Home = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: videosData,refetch:refetchVideos } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      return (await axiosInstance.get("/video")).data;
    },
  });

  

  const { data: categoryData,refetch:refetchCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return (await axiosInstance.get("/category")).data;
    },
  });
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetchVideos();
    await refetchCategories();
    setIsRefreshing(false);

  };

  const renderCategoryItem = ({ item }) => (
    <CategoryItem item={item}/>
  );

  const renderVideoItem = ({ item }) => (
    <View className="mb-4">
      <View className="relative">
        <TouchableOpacity onPress={()=>{router.push("(tabs)/singleVideo/"+item.id)}}>
          <Image
            source={{ uri: item.thumbnail }}
            className="w-full h-48 rounded-lg"
          />
        </TouchableOpacity>
      </View>
      <View className="mt-2 flex-row items-center">
        <User size={20} color="#666" />
        <Text className="ml-2 font-semibold">{item.title}</Text>
      </View>
      <Text className="text-sm text-gray-500">{`${item.views || 0} views • ${
        moment(item.createdAt).fromNow() || "unknown date"
      }`}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white" refreshControl={
      <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
    }>
      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Top Categories</Text>
        <FlatList
          data={categoryData?.data || []}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <View className="p-4">
        <Text className="text-2xl font-bold mb-4">Videos</Text>
        <FlatList
          data={videosData?.data || []}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

export default Home;
