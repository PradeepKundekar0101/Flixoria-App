import { View, Text } from 'react-native';
import React from 'react';

const ProfilePicture = ({ userName }) => {
  return (
    <View className="bg-white rounded-full w-12 h-12 items-center justify-center">
      <Text className="text-black font-bold text-xl">
        {userName.charAt(0).toUpperCase()}
      </Text>
    </View>
  );
};

export default ProfilePicture;