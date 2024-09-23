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
          className="w-6 h-6 mb-1"
        />
        <Text style={{ color }}>{name}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-night">
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#13f287",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#121212",
            borderTopColor: "#121212",
            borderTopWidth: 1,
            height: 36,
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
                icon={ICONS.plus}
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

        <Tabs.Screen
          name="singleVideo/[id]"
          options={{
            title: "Videos",
            href: null,
            headerShown: false,
            tabBarHideOnKeyboard: true,
          }}
        />

        <Tabs.Screen
          name="singleCategory/[id]"
          options={{
            title: "Categories",
            href: null,
            headerShown: false,
            tabBarHideOnKeyboard: true,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayout;
