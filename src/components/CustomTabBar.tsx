import React, { useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TAB_COUNT = 5;
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;
const CIRCLE_SIZE = 52;
const TAB_BAR_HEIGHT = 64;

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const TAB_CONFIG: {
  name: string;
  label: string;
  activeIcon: IoniconsName;
  inactiveIcon: IoniconsName;
}[] = [
  {
    name: "index",
    label: "Home",
    activeIcon: "home",
    inactiveIcon: "home-outline",
  },
  {
    name: "learn",
    label: "Learn",
    activeIcon: "book",
    inactiveIcon: "book-outline",
  },
  {
    name: "ai-teacher",
    label: "AI Teacher",
    activeIcon: "sparkles",
    inactiveIcon: "sparkles-outline",
  },
  {
    name: "chat",
    label: "Chat",
    activeIcon: "chatbubbles",
    inactiveIcon: "chatbubbles-outline",
  },
  {
    name: "profile",
    label: "Profile",
    activeIcon: "person",
    inactiveIcon: "person-outline",
  },
];

export default function CustomTabBar({
  state,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const activeIndex = state.index;

  const translateX = useSharedValue(activeIndex * TAB_WIDTH);

  useEffect(() => {
    translateX.value = withTiming(activeIndex * TAB_WIDTH, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
  }, [activeIndex]);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View
      style={[
        styles.wrapper,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 },
      ]}
    >
      <View style={styles.row}>
        {/* Sliding background circle */}
        <Animated.View style={[styles.activeCircle, animatedCircleStyle]} />

        {/* Tab items */}
        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[index];
          const isActive = index === activeIndex;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!event.defaultPrevented) {
              navigation.navigate(route.name, {});
            }
          };

          return (
            <Pressable
              key={route.key}
              style={styles.tabItem}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Ionicons
                name={isActive ? config.activeIcon : config.inactiveIcon}
                size={22}
                color={isActive ? "#ffffff" : "#9ca3af"}
              />
              {!isActive && (
                <Text style={styles.label} numberOfLines={1}>
                  {config.label}
                </Text>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: TAB_BAR_HEIGHT,
    position: "relative",
  },
  activeCircle: {
    position: "absolute",
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: "#6c4ef5",
    left: (TAB_WIDTH - CIRCLE_SIZE) / 2,
    top: (TAB_BAR_HEIGHT - CIRCLE_SIZE) / 2 - 2,
    zIndex: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    zIndex: 1,
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontFamily: "Poppins-Medium",
    color: "#9ca3af",
    lineHeight: 13,
  },
});
