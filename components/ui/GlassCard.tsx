// components/glass-card.tsx (Fixed - remove animation if causing issues)
import { useTheme } from "@/theme/useTheme"
import { BlurView } from "expo-blur"
import React, { forwardRef } from "react"
import {
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native"

type GlassCardVariant = "default" | "strong" | "subtle"

interface GlassCardProps extends PressableProps {
  variant?: GlassCardVariant
  hover?: boolean
  pressed?: boolean
  children: React.ReactNode
  style?: StyleProp<ViewStyle>
}

export const GlassCard = forwardRef<View, GlassCardProps>(
  (
    {
      variant = "default",
      hover = false,
      pressed = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const { colors, isDark } = useTheme()
   

    // Variant-specific blur intensities
    const blurIntensities: Record<GlassCardVariant, number> = {
      default: isDark ? 2 : 2,
      strong: isDark ? 12 : 10,
      subtle: isDark ? 3 : 3,
    }

    // Get blur tint based on theme
    const blurTint: "light" | "dark" = isDark ? "dark" : "light"

    // Remove animation initially to test
    return (
      <Pressable
        ref={ref}
        style={[
          styles.container,
          {
            backgroundColor: colors.glass,
            borderColor: "#2f2f35",
            borderWidth: 1,

            borderRadius: 20, // Fixed value instead of colors.radius.xl
            shadowColor: colors.glassShadow,
          },
          style,
        ]}
        {...props}
      >
        {/* Blur overlay */}
        <BlurView
          intensity={blurIntensities[variant]}
          tint={blurTint}
          style={StyleSheet.absoluteFill}
        />

        {/* Content */}
        <View style={styles.content}>
          {children}
        </View>
      </Pressable>
    )
  }
)

GlassCard.displayName = "GlassCard"

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
})

