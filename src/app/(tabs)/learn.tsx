import { View, Text, StyleSheet } from "react-native";

export default function LearnScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Learn</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  text: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 22,
    color: "#6c4ef5",
  },
});
