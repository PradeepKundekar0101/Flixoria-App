import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { router } from 'expo-router';
import { Clock, Eye, MoreVertical, Edit, Trash } from 'lucide-react-native';
import moment from 'moment';
import EditVideoModal from './editVideoModal';

const VideoItemSm = ({ item, self, onDelete, onEdit }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleEdit = () => {
    if(self){
      setMenuVisible(false);
      setEditModalVisible(true);
    }
  };

  const handleDelete = () => {
    if(self){
      setMenuVisible(false);
      onDelete(item.id);
    }
  };

  return (
    <TouchableOpacity 
      className="mb-4 flex-row"
      onPress={() => router.push(`(tabs)/singleVideo/${item.id}`)}
    >
      <Image
        source={{ uri: item.thumbnail }}
        className="w-1/3 h-24 rounded-lg mr-3"
      />
      <View className="flex-1 justify-between">
          <View className='flex flex-row justify-between'>

        <View className="flex-1 space-y-1">
          <Text className="font-semibold" numberOfLines={2}>{item.title}</Text>
          <Text className="font-light" numberOfLines={1}>{item.description}</Text>
        </View>
          {self && (
            <TouchableOpacity onPress={() => setMenuVisible(true)}>
              <MoreVertical size={20} color="#666" />
            </TouchableOpacity>
          )}
          </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Eye size={16} color="#666" />
            <Text className="ml-1 text-sm text-gray-500">{item.views || 0} views</Text>
            <Clock size={16} color="#666" className="ml-3" />
            <Text className="ml-1 text-sm text-gray-500">{moment(item.createdAt).fromNow()}</Text>
          </View>
        </View>
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
            <TouchableOpacity className="flex-row items-center py-2" onPress={handleEdit}>
              <Edit size={20} color="#666" />
              <Text className="ml-2">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center py-2" onPress={handleDelete}>
              <Trash size={20} color="#f00" />
              <Text className="ml-2 text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <EditVideoModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        video={item}
        onEdit={onEdit}
      />
    </TouchableOpacity>
  );
};

export default VideoItemSm;
