import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  TextInput,
} from "react-native";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../src/api/axiosInstance";
import { Search, User } from "lucide-react-native";
import moment from "moment";
import { router } from "expo-router";
import CategoryItem from "../../src/components/video/categoryItem";
import { LinearGradient } from "expo-linear-gradient";

const Home = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const {
    data: videosData,
    refetch: refetchVideos,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["videos", activeSearch],
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axiosInstance.get(
        `/video?search=${activeSearch}&page=${pageParam}&limit=10`
      );
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.data.length === 3 ? nextPage : undefined;
    },
  });

  const { data: categoryData, refetch: refetchCategories } = useQuery({
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

  const handleSearch = () => {
    setActiveSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    setActiveSearch("");
    refetchVideos();
  };

  const renderVideoItem = useCallback(
    ({ item }) => (
      <View className="mb-4 mx-4">
        <TouchableOpacity
          onPress={() => {
            router.push("(tabs)/singleVideo/" + item.id);
          }}
        >
          <Image
            source={{ uri: item.thumbnail }}
            className="w-full h-48 rounded-lg"
          />
        </TouchableOpacity>
        <View className="mt-2 flex-row items-center">
          <User size={20} color="#666" />
          <Text className="ml-2 font-semibold text-white">{item.title}</Text>
        </View>
        <Text className="text-sm text-gray-200">{`${item.views || 0} views • ${
          moment(item.createdAt).fromNow() || "unknown date"
        }`}</Text>
      </View>
    ),
    []
  );

  const loadMore = () => {
    if (!isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <FlatList
      className="flex-1 bg-night"
      ListHeaderComponent={() => (
        <>
          <LinearGradient
             start={{ x: -2, y: 2 }}
             end={{ x: -1, y: -1 }}
             locations={[0, 0.7, 1]}
             colors={['#02783f', '#121212', '#121212']}
            className="flex-1"
          >
            <View className="p-4">
              <Text className="text-2xl font-bold mb-4 text-springGreen">
                Top Categories
              </Text>
              <FlatList
                data={categoryData?.data || []}
                renderItem={({ item }) => <CategoryItem item={item} />}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View className="p-4">
              <Text className="text-2xl font-bold mb-2 text-springGreen">
                Videos
              </Text>
              <View className="flex w-full flex-row items-center justify-between mb-3">
                <TextInput
                  value={searchTerm}
                  onChangeText={(e) => setSearchTerm(e)}
                  placeholder="Search"
                  placeholderTextColor="gray"
                  // keyboardType="text"
                  className="flex-1 rounded-full border border-slate-700 h-10 px-4 text-white"
                />
                <TouchableOpacity onPress={handleSearch} className="ml-2">
                  <Search color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </>
      )}
      data={videosData?.pages.flatMap((page) => page.data) || []}
      renderItem={renderVideoItem}
      keyExtractor={(item) => item.id}
      onEndReached={loadMore}
      onEndReachedThreshold={0.1}
      ListEmptyComponent={
        activeSearch === "" ? (
          <View className="items-center justify-center flex-1">
            <Text className="text-slate-300 mb-1 text-lg">No Videos</Text>
            <Text className="text-slate-400 mb-1 text-lg">
              Be the first one to upload
            </Text>
            <TouchableOpacity
              onPress={() => router.push("upload")}
              className="border-springGreen border rounded-md px-3 py-1 text-lg"
            >
              <Text className="text-springGreen text-lg">Upload</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="items-center justify-center flex-1">
            <Text className="text-white text-lg">No Results found</Text>
            <TouchableOpacity
              onPress={handleClear}
              className="border-slate-600 border rounded-md px-3 py-1 text-lg mt-2"
            >
              <Text className="text-slate-600 text-lg">Clear</Text>
            </TouchableOpacity>
          </View>
        )
      }
      ListFooterComponent={() =>
        isFetchingNextPage ? (
          <Text className="text-white text-center mt-4">
            Loading more videos...
          </Text>
        ) : null
      }
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
      }
    />
  );
};

export default Home;
