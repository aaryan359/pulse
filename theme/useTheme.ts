// theme/useTheme.ts
import { useContext } from "react"
import { ThemeContext } from "./ThemeProvider"

/**
 * Hook to access theme colors, mode, and preferences
 * 
 * @example
 * const { colors, mode, setTheme, isDark } = useTheme()
 * 
 * @returns Theme context with colors, mode, preference, and utility functions
 */
export function useTheme() {
  const context = useContext(ThemeContext)
  
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  
  return context
}