import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";

interface PulseSpinnerProps {
  size?: number;
  color?: string;
  loading?: boolean;
}

export function PulseSpinner({
  size = 50,
  color = "#26A69A",
  loading = true,
}: PulseSpinnerProps) {
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    if (!loading) return;

    rotate.value = withRepeat(
      withTiming(360, {
        duration: 700,
        easing: Easing.linear,
      }),
      -1
    );

    scale.value = withRepeat(
      withTiming(1.08, {
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    opacity.value = withRepeat(
      withTiming(0.3, { duration: 800 }),
      -1,
      true
    );
  }, [loading]);

  if (!loading) return null;

  const spinnerStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.wrapper}>
      {/* Pulse glow */}
      <Animated.View
        style={[
          styles.pulse,
          {
            width: size + 14,
            height: size + 14,
            borderRadius: size,
            backgroundColor: color,
          },
          pulseStyle,
        ]}
      />

      {/* Spinner */}
      <Animated.View
        style={[
          styles.spinner,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: color,
          },
          spinnerStyle,
        ]}
      >
        <View
          style={[
            styles.inner,
            {
              width: size * 0.8,
              height: size * 0.8,
              borderRadius: size / 2,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  pulse: {
    position: "absolute",
  },
  spinner: {
    alignItems: "center",
    justifyContent: "center",
  },
  inner: {
    backgroundColor: "#009688",
  },
});
