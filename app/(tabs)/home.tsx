import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../src/api/axiosInstance';
import { Play, User } from 'lucide-react-native';
import moment from 'moment';
const Home = () => {
  const { data: videosData } = useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      return (await axiosInstance.get("/video")).data;
    }
  });

  const { data: categoryData } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      return (await axiosInstance.get("/category")).data;
    }
  });

  const renderCategoryItem = ({ item }) => (
    <View className="mr-4 items-center">
      <Image
        source={{ uri: item.thumbnail }}
        className="w-20 h-20 rounded-full"
      />
      <Text className="mt-2 text-center">{item.title}</Text>
    </View>
  );

  const renderVideoItem = ({ item }) => (
    <View className="mb-4">
      <View className="relative">
        <Image
          source={{ uri: item.thumbnail }}
          className="w-full h-48 rounded-lg"
        />
        <View className="absolute inset-0 flex items-center justify-center">
          <TouchableOpacity className="bg-white rounded-full p-2">
            <Play size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-2 flex-row items-center">
        <User size={20} color="#666" />
        <Text className="ml-2 font-semibold">{item.title}</Text>
      </View>
      <Text className="text-sm text-gray-500">{`${item.views || 0} views • ${ moment(item.createdAt).fromNow() || "unknown date" }`}</Text>
    </View>
  );



  return (
    <ScrollView className="flex-1 bg-white">
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