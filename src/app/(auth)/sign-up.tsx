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
import * as WebBrowser from "expo-web-browser";
import { useSignUp, useSSO } from "@clerk/expo";
import { images } from "@/constants/images";
import VerificationModal from "@/components/VerificationModal";
import { usePostHog } from "posthog-react-native";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startSSOFlow } = useSSO();
  const posthog = usePostHog();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const isSubmitting = fetchStatus === "fetching" && !modalVisible;
  const isVerifying = fetchStatus === "fetching" && modalVisible;

  const handleSignUp = async () => {
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) return;
    await signUp.verifications.sendEmailCode();
    setVerifyError(null);
    setModalVisible(true);
  };

  const handleVerify = async (code: string) => {
    setVerifyError(null);
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      setVerifyError(error.longMessage ?? error.message);
      return;
    }
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const userId = session?.user?.id;
          const userEmail = session?.user?.primaryEmailAddress?.emailAddress;
          if (userId) {
            posthog.identify(userId, {
              $set: { email: userEmail },
              $set_once: { sign_up_date: new Date().toISOString() },
            });
          }
          posthog.capture("user_signed_up", {
            method: "email_password",
            email: userEmail,
          });
          const url = decorateUrl("/");
          router.replace(url.startsWith("http") ? "/" : (url as "/"));
        },
      });
    }
  };

  const handleResend = async () => {
    setVerifyError(null);
    await signUp.verifications.sendEmailCode();
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setVerifyError(null);
  };

  const handleSocialAuth = async (
    strategy: "oauth_google" | "oauth_facebook" | "oauth_apple"
  ) => {
    posthog.capture("user_signed_up_via_sso", { strategy });
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: "duolingoclone://oauth-callback",
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("SSO error:", err);
    }
  };

  const emailError =
    errors?.fields?.emailAddress?.message ??
    errors?.global?.[0]?.longMessage ??
    errors?.global?.[0]?.message ??
    null;
  const passwordError = errors?.fields?.password?.message ?? null;

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
            <View>
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
              {!!emailError && (
                <Text style={styles.fieldError}>{emailError}</Text>
              )}
            </View>

            {/* Password */}
            <View>
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
              {!!passwordError && (
                <Text style={styles.fieldError}>{passwordError}</Text>
              )}
            </View>
          </View>

          {/* Clerk bot protection (required for sign-up flows) */}
          <View nativeID="clerk-captcha" />

          {/* Sign Up button */}
          <View className="px-6 mt-6">
            <TouchableOpacity
              style={[styles.primaryBtn, isSubmitting && styles.primaryBtnDisabled]}
              activeOpacity={0.85}
              onPress={handleSignUp}
              disabled={isSubmitting || !email || !password}
            >
              <Text style={styles.primaryBtnText}>
                {isSubmitting ? "Creating account…" : "Sign Up"}
              </Text>
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
              onPress={() => handleSocialAuth("oauth_google")}
            />
            <SocialButton
              icon={<FontAwesome5 name="facebook" size={20} color="#1877F2" brand />}
              label="Continue with Facebook"
              onPress={() => handleSocialAuth("oauth_facebook")}
            />
            <SocialButton
              icon={<FontAwesome5 name="apple" size={22} color="#000000" brand />}
              label="Continue with Apple"
              onPress={() => handleSocialAuth("oauth_apple")}
            />
          </View>

          {/* Footer */}
          <View className="flex-row justify-center items-center mt-8 pb-4">
            <Text className="text-body-sm text-muted">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/(auth)/sign-in")}
              activeOpacity={0.7}
            >
              <Text className="text-body-sm text-lingua-purple font-semibold">
                Log in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <VerificationModal
        visible={modalVisible}
        email={email || "your email"}
        onVerify={handleVerify}
        onResend={handleResend}
        onClose={handleCloseModal}
        error={verifyError}
        isLoading={isVerifying}
      />
    </SafeAreaView>
  );
}

function SocialButton({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.socialBtn} activeOpacity={0.75} onPress={onPress}>
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
  fieldError: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#ff4d4f",
    marginTop: 4,
    marginLeft: 4,
  },
  primaryBtn: {
    backgroundColor: "#6c4ef5",
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#4a30d4",
  },
  primaryBtnDisabled: {
    opacity: 0.6,
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
