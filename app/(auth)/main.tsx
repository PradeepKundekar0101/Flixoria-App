import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Text as SvgText, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { ICONS } from "../../src/constants/images";

const { width } = Dimensions.get('window');

const Index = () => {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const navigateToLogin = () => {
    router.push('(auth)/login');
  };

  const navigateToCreateAccount = () => {
    router.push('(auth)/createAccount');
  };

  return (
    <LinearGradient
      start={{ x: -1, y: -1 }}
      end={{ x: 2, y: 1 }}
      locations={[0, 0.7, 1]}
      colors={['#02783f', '#121212', '#121212']}
      className="flex-1"
    >
      <View className="flex-1 items-center justify-center p-5">
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY }] }}>
          <Image 
            source={ICONS.logo_transparent} 
            className="w-14 h-14 mb-2 mx-auto"
            resizeMode="contain"
          />
          <Text className="text-lg text-white mb-1 text-center">Welcome to </Text>

          <Svg height="50" width={width} style={{ marginBottom: 5 }}>
            <Defs>
              <SvgLinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#13F287" stopOpacity="1" /> 
                <Stop offset="0.5" stopColor="#02d610" stopOpacity="1" /> 
                <Stop offset="1" stopColor="#00AB0B" stopOpacity="1" /> 
              </SvgLinearGradient>
            </Defs>
            <SvgText
              fill="url(#grad)"
              fontSize="40"
              fontWeight="bold"
              x={width / 2}      
              y="30"
              textAnchor="middle"  
              alignmentBaseline="middle"
            >
              Flixoria
            </SvgText>
          </Svg>

          <Text className="text-xl font-light text-slate-200 mb-5 text-center">
            Where creators and viewers unite.
          </Text>
        </Animated.View>

        <View className="w-full">
          <TouchableOpacity 
            className="bg-transparent border-slate-400 border bg-opacity-20 py-2 px-8 rounded-md mb-4"
            onPress={navigateToLogin}
          >
            <Text className="text-slate-400 text-lg text-center">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-transparent border-slate-400 border bg-opacity-20 py-2 px-8 rounded-md mb-4"
            onPress={navigateToCreateAccount}
          >
            <Text className="text-slate-400 text-lg text-center">Create Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Index;