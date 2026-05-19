import { ActivityIndicator, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Redirect, useRouter } from "expo-router";
import { useAuth, useClerk } from "@clerk/expo";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6c4ef5" />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href="/onboarding" />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  // Home screen placeholder — replace with real home content in the next feature
  return (
    <View style={styles.home}>
      <Text style={styles.title}>muolingo</Text>
      <Text style={styles.subtitle}>{"You're signed in! 🎉"}</Text>
      <TouchableOpacity
        style={styles.languageBtn}
        onPress={() => router.push("/language-select")}
        activeOpacity={0.85}
      >
        <Text style={styles.languageBtnText}>Choose a Language</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.85}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  home: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    gap: 8,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 32,
    color: "#6c4ef5",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#6b7280",
  },
  languageBtn: {
    marginTop: 16,
    backgroundColor: "#6c4ef5",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
    borderBottomWidth: 4,
    borderBottomColor: "#4a30d4",
  },
  languageBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#ffffff",
  },
  signOutBtn: {
    backgroundColor: "#f6f7fb",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 14,
  },
  signOutText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#6b7280",
  },
});
