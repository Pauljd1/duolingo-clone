import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center bg-background gap-4">
      <Text className="text-h1 color-lingua-purple">muolingo</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/onboarding")}>
        <Text style={styles.buttonLabel}>View Onboarding →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6c4ef5",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#ffffff",
  },
});
