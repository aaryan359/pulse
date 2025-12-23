// lib/color-utils.ts
/**
 * Add opacity to a hex color
 * @param hexColor - Hex color without # (e.g., "EF4444")
 * @param opacity - Opacity as decimal (0-1)
 * @returns Hex color with opacity (e.g., "#EF44444D" for 30% opacity)
 */
export function addOpacityToHex(hexColor: string, opacity: number): string {
  // Remove # if present
  const cleanHex = hexColor.replace('#', '')
  
  // Convert opacity to hex (0-255)
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')
    .toUpperCase()
  
  return `#${cleanHex}${alpha}`
}

/**
 * Common opacity values matching Tailwind conventions
 */
export const opacity = {
  10: "1A", // 10%
  20: "33", // 20%
  30: "4D", // 30%
  40: "66", // 40%
  50: "80", // 50%
  60: "99", // 60%
  70: "B3", // 70%
  80: "CC", // 80%
  90: "E6", // 90%
}