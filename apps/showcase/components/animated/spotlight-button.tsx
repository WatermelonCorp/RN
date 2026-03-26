import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Text } from "@/registry/components/ui/text";

type SpotlightButtonVariant = "default" | "neutral";
type SpotlightButtonSize = "default" | "lg";

type SpotlightButtonProps = Omit<PressableProps, "children"> & {
  badge?: string;
  children: React.ReactNode;
  variant?: SpotlightButtonVariant;
  size?: SpotlightButtonSize;
};

function getPalette(theme: "light" | "dark", variant: SpotlightButtonVariant) {
  if (variant === "neutral") {
    return theme === "dark"
      ? {
          background: "#18181b",
          border: "rgba(255,255,255,0.10)",
          text: "#f4f4f5",
          badgeBackground: "rgba(255,255,255,0.08)",
          badgeBorder: "rgba(255,255,255,0.14)",
          badgeText: "#d4d4d8",
          glow: "rgba(255,255,255,0.12)",
          shadow: "rgba(0,0,0,0.45)",
        }
      : {
          background: "#ffffff",
          border: "rgba(15,23,42,0.10)",
          text: "#111827",
          badgeBackground: "rgba(15,23,42,0.05)",
          badgeBorder: "rgba(15,23,42,0.08)",
          badgeText: "#475569",
          glow: "rgba(59,130,246,0.14)",
          shadow: "rgba(15,23,42,0.14)",
        };
  }

  return theme === "dark"
    ? {
        background: "#60a5fa",
        border: "rgba(191,219,254,0.45)",
        text: "#08111f",
        badgeBackground: "rgba(255,255,255,0.30)",
        badgeBorder: "rgba(255,255,255,0.35)",
        badgeText: "#0f172a",
        glow: "rgba(96,165,250,0.34)",
        shadow: "rgba(37,99,235,0.34)",
      }
    : {
        background: Colors.light.tint,
        border: "rgba(125,211,252,0.45)",
        text: "#eff6ff",
        badgeBackground: "rgba(255,255,255,0.18)",
        badgeBorder: "rgba(255,255,255,0.22)",
        badgeText: "#e0f2fe",
        glow: "rgba(14,165,233,0.24)",
        shadow: "rgba(14,165,233,0.28)",
      };
}

function getContainerStyle(size: SpotlightButtonSize): StyleProp<ViewStyle> {
  if (size === "lg") return styles.containerLg;
  return styles.containerDefault;
}

export function SpotlightButton({
  badge = "New",
  children,
  variant = "default",
  size = "default",
  style,
  ...props
}: SpotlightButtonProps) {
  const theme = useColorScheme() ?? "light";
  const shimmerX = useRef(new Animated.Value(-220)).current;
  const glowPulse = useRef(new Animated.Value(0.88)).current;
  const palette = useMemo(() => getPalette(theme, variant), [theme, variant]);

  useEffect(() => {
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerX, {
        toValue: 220,
        duration: 2600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1.06,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.88,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    shimmerLoop.start();
    glowLoop.start();

    return () => {
      shimmerLoop.stop();
      glowLoop.stop();
    };
  }, [glowPulse, shimmerX]);

  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      style={(state) => {
        const { pressed } = state;
        const resolvedStyle =
          typeof style === "function" ? style(state) : style;

        return [
          styles.wrapper,
          {
            transform: [{ scale: pressed ? 0.985 : 1 }],
            opacity: props.disabled ? 0.55 : 1,
          },
          resolvedStyle,
        ];
      }}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.containerBase,
            getContainerStyle(size),
            {
              backgroundColor: palette.background,
              borderColor: palette.border,
              shadowColor: palette.shadow,
            },
            pressed && styles.containerPressed,
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.glow,
              {
                backgroundColor: palette.glow,
                transform: [{ scale: glowPulse }],
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.shimmer,
              {
                transform: [{ translateX: shimmerX }, { rotate: "16deg" }],
              },
            ]}
          />
          <View
            style={[
              styles.badge,
              {
                backgroundColor: palette.badgeBackground,
                borderColor: palette.badgeBorder,
              },
            ]}
          >
            <Text style={[styles.badgeText, { color: palette.badgeText }]}>
              {badge}
            </Text>
          </View>
          <View style={styles.labelRow}>
            <Text style={[styles.labelText, { color: palette.text }]}>
              {children}
            </Text>
            <Text style={[styles.arrow, { color: palette.text }]}>→</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 18,
  },
  containerBase: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.24,
    shadowRadius: 26,
    elevation: 6,
  },
  containerDefault: {
    minHeight: 52,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  containerLg: {
    minHeight: 58,
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  containerPressed: {
    opacity: 0.96,
  },
  glow: {
    position: "absolute",
    left: -24,
    right: -24,
    bottom: -14,
    height: 44,
    borderRadius: 999,
  },
  shimmer: {
    position: "absolute",
    top: -10,
    bottom: -10,
    width: 84,
    backgroundColor: "rgba(255,255,255,0.20)",
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  labelText: {
    fontSize: 15,
    fontWeight: "700",
  },
  arrow: {
    fontSize: 16,
    fontWeight: "700",
  },
});
