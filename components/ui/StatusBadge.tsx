// components/status-badge.tsx
import { useTheme } from "@/theme/useTheme"
import React, { useEffect, useRef } from "react"
import { Animated, StyleSheet, Text, View } from "react-native"

interface StatusBadgeProps {
  status: "online" | "offline" 
  label?: string
  pulse?: boolean
}

export function StatusBadge({ status, label, pulse = true }: StatusBadgeProps) {
  const { colors } = useTheme()
  const pulseAnim = useRef(new Animated.Value(1)).current
  
  const statusLabels = {
    online: "Online",
    offline: "Offline",
    warning: "Warning",
  }
  
  const statusColors = {
    online: colors.statusOnline,
    offline: colors.statusOffline,
    warning: colors.statusWarning,
  }

  // Pulse animation for online status
  useEffect(() => {
    if (pulse && status === "online") {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 2,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      )
      animation.start()
      
      return () => animation.stop()
    }
  }, [pulse, status])

  return (
    <View style={styles.container}>
      <View style={styles.dotContainer}>
        {/* Pulse ring for online status */}
        {pulse && status === "online" && (
          <Animated.View
            style={[
              styles.pulseRing,
              {
                backgroundColor: statusColors[status],
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
        )}
        
        {/* Solid dot */}
        <View
          style={[
            styles.dot,
            { backgroundColor: statusColors[status] },
          ]}
        />
      </View>
      
      <Text style={[styles.label, { color: colors.foreground }]}>
        {label !== undefined ? label : statusLabels[status]}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dotContainer: {
    width: 10, // h-2.5 = 10px (2.5 * 4)
    height: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  pulseRing: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    opacity: 0.75,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
})