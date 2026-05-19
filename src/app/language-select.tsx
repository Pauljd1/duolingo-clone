import { images } from "@/constants/images";
import { languages } from "@/data/languages";
import type { Language } from "@/types/learning";
import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import { useProgressStore } from "@/store/useProgressStore";
import type { LanguageCode } from "@/types/learning";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Language Row ─────────────────────────────────────────────────────────────

function LanguageRow({
  language,
  selected,
  onPress,
}: {
  language: Language;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={
        selected
          ? "flex-row items-center px-4 py-[14px] mx-4 mb-[6px] rounded-xl border-2 border-lingua-purple bg-[#f0edff]"
          : "flex-row items-center px-4 py-[14px] mx-4 mb-[6px] rounded-xl bg-white"
      }
    >
      {/* Flag circle */}
      <View className="w-11 h-11 rounded-full bg-surface items-center justify-center mr-3">
        <Text style={styles.flagEmoji}>{language.flag}</Text>
      </View>

      {/* Name + learner count */}
      <View className="flex-1">
        <Text className="text-h4 text-foreground">{language.name}</Text>
        <Text className="text-caption text-muted">{language.learnerCount}</Text>
      </View>

      {/* Right icon: check circle if selected, chevron if not */}
      {selected ? (
        <View className="w-6 h-6 rounded-full bg-lingua-purple items-center justify-center">
          <Text style={styles.checkmark}>✓</Text>
        </View>
      ) : (
        <Text style={styles.chevron}>›</Text>
      )}
    </TouchableOpacity>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function LanguageSelectScreen() {
  const router = useRouter();
  const { selectedLanguage, setSelectedLanguage } = useProgressStore();
  const [selectedCode, setSelectedCode] = useState<LanguageCode | null>(selectedLanguage);
  const [search, setSearch] = useState("");

  const filtered = languages.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleConfirm = () => {
    if (!selectedCode) return;
    setSelectedLanguage(selectedCode);
    // Replace so the user cannot press back into language selection from home
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header ── */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="w-8 h-8 items-center justify-center"
        >
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text
          className="flex-1 text-center text-foreground"
          style={styles.headerTitle}
        >
          Choose a language
        </Text>
        {/* Spacer to balance the back button */}
        <View className="w-8" />
      </View>

      {/* ── Search bar ── */}
      <View className="px-4 mb-4">
        <View
          className="flex-row items-center bg-surface rounded-2xl px-4 border border-border"
          style={{ height: 50 }}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search languages"
            placeholderTextColor="#9ca3af"
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* ── Language list ── */}
      <FlatList
        style={{ flex: 1 }}
        data={filtered}
        keyExtractor={(item) => item.code}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text
            className="text-foreground px-4 mb-3"
            style={styles.sectionLabel}
          >
            Popular
          </Text>
        }
        renderItem={({ item }) => (
          <LanguageRow
            language={item}
            selected={selectedCode === item.code}
            onPress={() => setSelectedCode(item.code)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 8 }}
      />

      {/* ── Confirm button ── */}
      <View className="px-4 pt-3 pb-3">
        <TouchableOpacity
          onPress={handleConfirm}
          activeOpacity={0.85}
          disabled={!selectedCode}
          className={
            selectedCode
              ? "bg-lingua-purple py-[17px] rounded-2xl items-center border-b-4"
              : "bg-border py-[17px] rounded-2xl items-center"
          }
          style={selectedCode ? styles.confirmShadow : undefined}
        >
          <Text
            style={[
              styles.confirmText,
              { color: selectedCode ? "#ffffff" : "#9ca3af" },
            ]}
          >
            Confirm
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Earth illustration ── */}
      <Image
        source={images.earth}
        style={{ width: "100%", height: 130 }}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
  },
  backArrow: {
    fontSize: 26,
    color: "#001328",
    fontFamily: "Poppins-Medium",
    lineHeight: 30,
  },
  sectionLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
  flagEmoji: {
    fontSize: 26,
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Poppins-Bold",
  },
  chevron: {
    fontSize: 22,
    color: "#c0c0c0",
    fontFamily: "Poppins-Regular",
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: "#9ca3af",
  },
  searchInput: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#001328",
    paddingVertical: 0,
  },
  confirmText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
  },
  // iOS shadow for the active confirm button
  confirmShadow: {
    borderBottomColor: "#4a30d4",
    shadowColor: "#6c4ef5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
});
