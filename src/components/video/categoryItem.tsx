import { View, Text, TouchableOpacity,Image } from 'react-native'
import React from 'react'
import { router } from 'expo-router'

const CategoryItem = ({item}:{item:any}) => {
  return (
    <TouchableOpacity onPress={()=>{router.push("(tabs)/singleCategory/"+item.id)}} className="mr-4 items-center">
        <Image
          source={{ uri: item.thumbnail }}
          className="w-20 h-20 rounded-full"
        />
        <Text className="mt-2 text-center">{item.title}</Text>
      </TouchableOpacity>
  )
}

export default CategoryItem