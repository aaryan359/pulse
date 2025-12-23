// theme/useThemeSwitch.ts
import { useTheme } from "./useTheme"

/**
 * Hook for theme switching operations with improved logic
 * 
 * @example
 * const { toggleTheme, cycleTheme, isDarkMode } = useThemeSwitch()
 * 
 * @returns Theme switching utilities and current state
 */
export function useThemeSwitch() {
  const { mode, preference, setTheme, isDark } = useTheme()

  const setLightMode = () => setTheme("light")
  const setDarkMode = () => setTheme("dark")
  const setSystemMode = () => setTheme("system")

  // Simple toggle between light/dark
  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark")
  }

  // Cycle through all three states: light → dark → system → light
  const cycleTheme = () => {
    if (preference === "light") {
      setDarkMode()
    } else if (preference === "dark") {
      setSystemMode()
    } else {
      setLightMode()
    }
  }

  // Check current state
  const isSystemMode = preference === "system"
  const isLightMode = mode === "light"
  const isDarkMode = mode === "dark"

  return {
    // Current state
    currentMode: mode,
    themePreference: preference,
    isDarkMode,
    isLightMode,
    isSystemMode,
    
    // Boolean helpers
    isUsingSystemTheme: isSystemMode,
    isUsingCustomTheme: !isSystemMode,
    
    // Direct setters
    setLightMode,
    setDarkMode,
    setSystemMode,
    
    // Switching functions
    toggleTheme,
    cycleTheme,
    
    // Quick checks
    getStatusColor: (status: "online" | "offline" | "warning") => {
      const { colors } = useTheme()
      return {
        online: colors.statusOnline,
        offline: colors.statusOffline,
        warning: colors.statusWarning,
      }[status]
    },
    
    getEnvColor: (env: "production" | "staging" | "development") => {
      const { colors } = useTheme()
      return {
        production: colors.envProduction,
        staging: colors.envStaging,
        development: colors.envDevelopment,
      }[env]
    },
  }
}