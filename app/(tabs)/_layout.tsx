import { Tabs } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, Text } from "react-native";
import { ICONS } from "../../src/constants/images";
const TabsLayout = () => {
  const TabIconComponent = ({ name, icon, focused, color }) => {
    return (
      <View className=" items-center  justify-center  ">
        <Image
          source={icon}
          tintColor={color}
          resizeMode={"contain"}
          className="w-6 h-6"
        />
        <Text style={{ color }}>{name}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1">
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#52b788",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopColor: "#232533",
            borderTopWidth: 1,
            height: 76,
          },
        }}
        backBehavior="history"
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIconComponent
                name={"Home"}
                focused={focused}
                icon={ICONS.home}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="upload"
          options={{
            title: "Upload",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIconComponent
                name={"Upload"}
                focused={focused}
                icon={ICONS.journal}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ focused, color }) => (
              <TabIconComponent
                name={"Profile"}
                focused={focused}
                icon={ICONS.mentor}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;
