import { images } from "@/constants/images";
import { Redirect, Stack, router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@clerk/expo";

export default function OnboardingScreen() {
  const { isSignedIn, isLoaded } = useAuth();

  if (isLoaded && isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Logo Row */}
      <View className="flex-row items-center justify-center pt-6 gap-2">
        <Image
          source={images.mascotLogo}
          className="w-9 h-9"
          resizeMode="contain"
        />
        <Text className="text-h3 text-foreground">muolingo</Text>
      </View>

      {/* Hero Text */}
      <View className="px-7 mt-8">
        <Text className="text-h1 text-foreground">
          {"Your AI language\n"}
          <Text className="text-h1 text-lingua-purple">teacher</Text>
          {"."}
        </Text>
        <Text className="text-body-md text-muted mt-2">
          Real conversations, personalized{"\n"}lessons, anytime, anywhere.
        </Text>
      </View>

      {/* Illustration Area */}
      <View className="flex-1 relative items-center justify-center">
        {/* Hello! bubble */}
        <View
          className="absolute left-6 top-[35%] bg-white rounded-[20px] px-4 py-[10px] z-10"
          style={styles.shadow}
        >
          <Text className="text-body-md text-foreground font-[Poppins-Medium]">
            Hello!
          </Text>
        </View>

        {/* ¡Hola! bubble */}
        <View
          className="absolute right-5 top-[12%] bg-white rounded-[20px] px-4 py-[10px] z-10"
          style={styles.shadow}
        >
          <Text className="text-body-md text-foreground font-[Poppins-Medium]">
            ¡Hola!
          </Text>
        </View>

        {/* 你好! bubble */}
        <View
          className="absolute right-4 top-[58%] bg-white rounded-[20px] px-4 py-[10px] z-10 border border-[#ffd0d0]"
          style={styles.shadow}
        >
          <Text className="text-body-md text-[#e03737] font-[Poppins-Medium]">
            你好!
          </Text>
        </View>

        <Image
          source={images.mascot}
          className="w-[260px] h-[260px]"
          resizeMode="contain"
        />
      </View>

      {/* Get Started Button */}
      <View className="px-6 pb-6">
        <TouchableOpacity
          className="bg-lingua-purple rounded-2xl py-[17px] flex-row items-center justify-center gap-2 border-b-4"
          style={{ borderBottomColor: "#4a30d4" }}
          onPress={() => router.push("/(auth)/sign-up")}
          activeOpacity={0.85}
        >
          <Text className="text-[17px] font-[Poppins-SemiBold] text-white">
            Get Started
          </Text>
          <Text className="text-[22px] font-[Poppins-Regular] text-white leading-[26px]">
            ›
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  // Shadow props differ between iOS (shadowColor/offset/opacity/radius) and
  // Android (elevation), so StyleSheet is required per AGENTS.md exception rules.
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
});
