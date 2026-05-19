import { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onClose: () => void;
  error?: string | null;
  isLoading?: boolean;
}

export default function VerificationModal({
  visible,
  email,
  onVerify,
  onResend,
  onClose,
  error,
  isLoading = false,
}: Props) {
  const [code, setCode] = useState("");
  const inputRef = useRef<TextInput>(null);

  // Focus the hidden input when modal opens
  useEffect(() => {
    if (visible) {
      setCode("");
      const timer = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (code.length === 6 && !isLoading) {
      onVerify(code);
    }
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear code when an error comes back so the user can retype
  useEffect(() => {
    if (error) {
      setCode("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [error]);

  const handleCodeChange = (text: string) => {
    setCode(text.replace(/[^0-9]/g, "").slice(0, 6));
  };

  const handleResend = async () => {
    setCode("");
    await onResend();
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.kav}
        >
          <TouchableOpacity style={styles.dismissArea} onPress={onClose} />

          <View style={styles.sheet}>
            <View style={styles.handle} />

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={22} color="#6b7280" />
            </TouchableOpacity>

            <View style={styles.iconCircle}>
              <Ionicons name="mail-outline" size={32} color="#6c4ef5" />
            </View>

            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit code to{"\n"}
              <Text style={styles.emailText}>{email}</Text>
            </Text>

            {/* OTP digit boxes — tap anywhere to focus the hidden input */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => inputRef.current?.focus()}
              style={styles.otpRow}
            >
              {Array.from({ length: 6 }, (_, i) => {
                const digit = code[i];
                const isActive = i === code.length && code.length < 6;
                return (
                  <View
                    key={i}
                    style={[
                      styles.digitBox,
                      digit ? styles.digitFilled : styles.digitEmpty,
                      isActive && styles.digitActive,
                      !!error && styles.digitError,
                    ]}
                  >
                    {isLoading && i === 0 && !digit ? (
                      <ActivityIndicator size="small" color="#6c4ef5" />
                    ) : (
                      <Text style={styles.digitText}>{digit || ""}</Text>
                    )}
                  </View>
                );
              })}
            </TouchableOpacity>

            {/* Error message */}
            {!!error && (
              <Text style={styles.errorText}>{error}</Text>
            )}

            {/* Loading indicator during verification */}
            {isLoading && (
              <View style={styles.loadingRow}>
                <ActivityIndicator size="small" color="#6c4ef5" />
                <Text style={styles.loadingText}>Verifying…</Text>
              </View>
            )}

            {/* Hidden TextInput receives keyboard input */}
            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleCodeChange}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.hiddenInput}
              caretHidden
              editable={!isLoading}
            />

            <TouchableOpacity
              onPress={handleResend}
              activeOpacity={0.7}
              disabled={isLoading}
              style={styles.resendRow}
            >
              <Text style={styles.resendText}>
                {"Didn't receive a code? "}
                <Text style={styles.resendLink}>Resend</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.bottomPad} />
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  kav: {
    flex: 1,
    justifyContent: "flex-end",
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: "center",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#e5e7eb",
    marginBottom: 12,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f0ecff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#001328",
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 22,
  },
  emailText: {
    fontFamily: "Poppins-Medium",
    color: "#001328",
  },
  otpRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 28,
    marginBottom: 8,
  },
  digitBox: {
    width: 46,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  digitEmpty: {
    borderColor: "#e5e7eb",
    backgroundColor: "#f6f7fb",
  },
  digitFilled: {
    borderColor: "#6c4ef5",
    backgroundColor: "#ffffff",
  },
  digitActive: {
    borderColor: "#6c4ef5",
    backgroundColor: "#f0ecff",
  },
  digitError: {
    borderColor: "#ff4d4f",
  },
  digitText: {
    fontFamily: "Poppins-Bold",
    fontSize: 22,
    color: "#001328",
  },
  errorText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#ff4d4f",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 8,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
  },
  loadingText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6b7280",
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  resendRow: {
    marginTop: 20,
  },
  resendText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#6b7280",
  },
  resendLink: {
    fontFamily: "Poppins-SemiBold",
    color: "#6c4ef5",
  },
  bottomPad: {
    height: 36,
  },
});
