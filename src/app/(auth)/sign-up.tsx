import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { images } from "@/constants/images";
import VerificationModal from "@/components/VerificationModal";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={26} color="#001328" />
          </TouchableOpacity>

          {/* Title */}
          <View className="px-6 mt-4">
            <Text className="text-h1 text-foreground">Create your account</Text>
            <Text className="text-body-md text-muted mt-1">
              Start your language journey today ✨
            </Text>
          </View>

          {/* Mascot */}
          <View className="items-center mt-5 mb-5">
            <Image
              source={images.mascotAuth}
              style={styles.mascot}
              resizeMode="contain"
            />
          </View>

          {/* Inputs */}
          <View className="px-6 gap-4">
            {/* Email */}
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="alex@gmail.com"
                placeholderTextColor="#9ca3af"
                style={styles.inputText}
              />
            </View>

            {/* Password */}
            <View style={[styles.inputBox, styles.inputBoxRow]}>
              <View style={styles.inputLeft}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                  placeholderTextColor="#9ca3af"
                  style={styles.inputText}
                />
              </View>
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                activeOpacity={0.7}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up button */}
          <View className="px-6 mt-6">
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.primaryBtnText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View className="flex-row items-center px-6 mt-6 gap-3">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-body-sm text-muted">or continue with</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Social buttons */}
          <View className="px-6 mt-4 gap-4">
            <SocialButton
              icon={<FontAwesome5 name="google" size={20} color="#EA4335" brand />}
              label="Continue with Google"
            />
            <SocialButton
              icon={<FontAwesome5 name="facebook" size={20} color="#1877F2" brand />}
              label="Continue with Facebook"
            />
            <SocialButton
              icon={<FontAwesome5 name="apple" size={22} color="#000000" brand />}
              label="Continue with Apple"
            />
          </View>

          {/* Footer */}
          <View className="flex-row justify-center items-center mt-8 pb-4">
            <Text className="text-body-sm text-muted">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")} activeOpacity={0.7}>
              <Text className="text-body-sm text-lingua-purple font-[Poppins-SemiBold]">
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={modalVisible}
        email={email || "your email"}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

function SocialButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75}>
      <View style={styles.socialIcon}>{icon}</View>
      <Text style={styles.socialLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  kav: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  backBtn: {
    marginTop: 8,
    marginLeft: 16,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  mascot: {
    width: 160,
    height: 160,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#ffffff",
  },
  inputBoxRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputLeft: {
    flex: 1,
  },
  inputLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 2,
  },
  inputText: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#001328",
    padding: 0,
  },
  eyeBtn: {
    paddingLeft: 8,
  },
  primaryBtn: {
    backgroundColor: "#6c4ef5",
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#4a30d4",
  },
  primaryBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
    color: "#ffffff",
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
  },
  socialIcon: {
    width: 24,
    alignItems: "center",
  },
  socialLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#001328",
  },
});
