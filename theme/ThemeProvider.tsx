// theme/ThemeProvider.tsx
import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { createContext, useEffect, useMemo, useState } from "react"
import { Appearance } from "react-native"
import { theme, ThemeMode, ThemePreference } from "./theme"

type ThemeContextType = {
  mode: ThemeMode
  preference: ThemePreference
  colors: typeof theme.light.colors
  radius: typeof theme.light.radius
  setTheme: (mode: ThemePreference) => Promise<void>
  isDark: boolean
  blurIntensity: number
}

export const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType
)

const STORAGE_KEY = "@theme-preference"

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [preference, setPreference] = useState<ThemePreference>("system")
  const [systemMode, setSystemMode] = useState<ThemeMode>(
    Appearance.getColorScheme() ?? "light"
  )

  // Load saved theme preference
  useEffect(() => {
    loadThemePreference()
  }, [])

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemMode(colorScheme === "dark" ? "dark" : "light")
    })
    
    return () => subscription.remove()
  }, [])

  const loadThemePreference = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored === "light" || stored === "dark" || stored === "system") {
        setPreference(stored)
      }
    } catch (error) {
      console.error("Failed to load theme preference:", error)
    }
  }

  const persistThemePreference = async (mode: ThemePreference) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, mode)
    } catch (error) {
      console.error("Failed to save theme preference:", error)
    }
  }

  const setTheme = async (mode: ThemePreference) => {
    setPreference(mode)
    await persistThemePreference(mode)
  }

  // Resolve final theme mode
  const resolvedMode: ThemeMode = 
    preference === "system" ? systemMode : preference

  // Blur intensity based on theme (for glass effects)
  const blurIntensity = resolvedMode === "dark" ? 20 : 15

  // Memoized context value
  const value = useMemo(() => {
    const currentTheme = theme[resolvedMode]
    
    return {
      mode: resolvedMode,
      preference,
      colors: currentTheme.colors,
      radius: currentTheme.radius,
      setTheme,
      isDark: resolvedMode === "dark",
      blurIntensity,
    }
  }, [resolvedMode, preference, blurIntensity])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}