import {
  BlurMask,
  Canvas,
  Circle,
  RadialGradient,
  vec,
} from "@shopify/react-native-skia"
import React from "react"
import { StyleProp, ViewStyle } from "react-native"

interface SkiaGlowBlobProps {
  color: string
  size: number
  style?: StyleProp<ViewStyle>
  intensity?: number   
}

export function SkiaGlowBlob({
  color,
  size,
  intensity = 0.15,
  style,
}: SkiaGlowBlobProps) {
  return (
    <Canvas
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          width: size * 2.2,
          height: size * 2.2,
          opacity: intensity,
        },
        style,
      ]}
    >
      <Circle
        cx={size}
        cy={size}
        r={size}
      >
        {/* Soft gradient core */}
        <RadialGradient
          c={vec(size, size)}
          r={size}
          colors={[
            `${color}AA`,
            `${color}33`,
            "transparent",
          ]}
        />

        {/* Strong blur for bloom */}
        <BlurMask blur={size * 0.6} style="normal" />
      </Circle>
    </Canvas>
  )
}
