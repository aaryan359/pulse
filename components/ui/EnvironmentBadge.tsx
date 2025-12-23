// components/environment-badge.tsx (updated with color helper)
import { useTheme } from "@/theme/useTheme"
import { addOpacityToHex } from "@/utils/color-utils"
import React from "react"
import { StyleSheet, Text, View } from "react-native"


interface EnvironmentBadgeProps {
  environment: "production" | "staging" | "development"
  size?: "sm" | "md"
}

export function EnvironmentBadge({ 
  environment, 
  size = "sm" 
}: EnvironmentBadgeProps) {
  const { colors } = useTheme()
  
  const labels = {
    production: "Prod",
    staging: "Stage",
    development: "Dev",
  }
  
  const environmentColors = {
    production: colors.envProduction,
    staging: colors.envStaging,
    development: colors.envDevelopment,
  }
  
  const color = environmentColors[environment]
  const bgColor = addOpacityToHex(color.replace('#', ''), 0.2) 
  const borderColor = addOpacityToHex(color.replace('#', ''), 0.3) 
  
  const sizeStyles = {
    sm: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      fontSize: 12,
      borderRadius: 999,
      borderWidth: 1,
    },
    md: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      fontSize: 14,
      borderRadius: 999,
      borderWidth: 1,
    },
  }

  const currentSize = sizeStyles[size]

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColor,
          borderColor: borderColor,
          ...currentSize,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: currentSize.fontSize,
            color: color,
            fontWeight: "500",
          },
        ]}
      >
        {labels[environment]}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
  },
  text: {
    fontWeight: "500",
  },
})