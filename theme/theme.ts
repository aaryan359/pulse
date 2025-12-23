// theme/theme.ts
export type ThemeMode = "light" | "dark"
export type ThemePreference = ThemeMode | "system"

export const radius = {
  sm: 12,  // calc(var(--radius) - 4px) where --radius = 1rem = 16px
  md: 14,  // calc(var(--radius) - 2px)
  lg: 16,  // var(--radius)
  xl: 20,  // calc(var(--radius) + 4px)
  "2xl": 24, // calc(var(--radius) + 8px)
} as const

export const lightTheme = {
  mode: "light" as ThemeMode,
  colors: {
    // OKLCH colors converted to HEX/RGBA
    background: "#F8F9FC",
    foreground: "#1A202C",

    card: "rgba(255,255,255,0.6)",
    cardForeground: "#1A202C",

    glowBlue: "#93C5FD",    // soft sky blue
    glowGreen: "#86EFAC",   // mint green
    glowYellow: "#FDE68A",  // warm pastel yellow
    glowRed: "#FCA5A5",     // soft coral red


    popover: "rgba(255,255,255,0.8)",
    popoverForeground: "#1A202C",

    primary: "#6366F1",
    primaryForeground: "#FFFFFF",

    secondary: "#F1F3F9",
    secondaryForeground: "#1A202C",

    muted: "#E9ECF4",
    mutedForeground: "#6B7280",

    accent: "#06B6D4",
    accentForeground: "#1A202C",

    destructive: "#EF4444",
    destructiveForeground: "#FFFFFF",

    border: "rgba(222,226,235,0.5)",
    input: "#F1F3F9",
    ring: "#6366F1",

    /* Liquid Glass System */
    glass: "rgba(255,255,255,0.4)",
    glassBorder: "rgba(255,255,255,0.3)",
    glassHighlight: "rgba(255,255,255,0.6)",
    glassSurface: "rgba(255,255,255,0.25)",
    glassInset: "rgba(255,255,255,0.15)",
    glassShadow: "rgba(99,102,241,0.08)",
    glassReflection: "rgba(99,102,241,0.12)",

    /* Environment Colors */
    envProduction: "#EF4444",
    envStaging: "#F59E0B",
    envDevelopment: "#6366F1",

    /* Status Colors */
    statusOnline: "#10B981",
    statusOffline: "#DC2626",
    statusWarning: "#F59E0B",

    /* Chart Colors */
    chart1: "#6366F1",
    chart2: "#06B6D4",
    chart3: "#10B981",
    chart4: "#F59E0B",
    chart5: "#EF4444",

    /* Sidebar Colors */
    sidebar: "#FCFCFD",
    sidebarForeground: "#242424",
    sidebarPrimary: "#343434",
    sidebarPrimaryForeground: "#FCFCFD",
    sidebarAccent: "#F7F7F7",
    sidebarAccentForeground: "#343434",
    sidebarBorder: "#EBEBEB",
    sidebarRing: "#B5B5B5",
  },
  radius,
}

export const darkTheme = {
  mode: "dark" as ThemeMode,
  colors: {
    // OKLCH colors converted to HEX/RGBA
    background: "#000000ff",
    foreground: "#E5E7EB",

    card: "rgba(38,47,66,0.6)",
    cardForeground: "#F1F3F9",

    // Dark theme
    glowBlue: "#3B82F6",
    glowGreen: "#22C55E",
    glowYellow: "#FACC15",
    glowRed: "#EF4444",

    popover: "rgba(33,40,57,0.9)",
    popoverForeground: "#F1F3F9",

    primary: "#3B82F6",
    primaryForeground: "#0D1521",

    secondary: "#2C3649",
    secondaryForeground: "#F1F3F9",

    muted: "#364054",
    mutedForeground: "#9CA3AF",

    accent: "#22D3EE",
    accentForeground: "#F1F3F9",

    destructive: "#EF4444",
    destructiveForeground: "#F1F3F9",

    border: "rgba(72,84,109,0.5)",
    input: "#2C3649",
    ring: "#818CF8",

    /* Liquid Glass System - Dark */
    glass: "rgba(12, 18, 29, 1)",
    glassBorder: "rgba(255,255,255,0.05)",
    glassHighlight: "rgba(128,149,191,0.2)",
    glassSurface: "rgba(38,47,66,0.6)",
    glassInset: "rgba(255,255,255,0.02)",
    glassShadow: "rgba(0,0,0,0.6)",
    glassReflection: "rgba(129,140,248,0.15)",

    /* Environment Colors - Dark */
    envProduction: "#F87171",
    envStaging: "#FBBF24",
    envDevelopment: "#818CF8",

    /* Status Colors - Dark */
    statusOnline: "#22C55E",         // muted green
    statusOffline: "#EF4444",        // muted red
    statusWarning: "#FACC15",

    /* Chart Colors - Dark */
    chart1: "#818CF8",
    chart2: "#22D3EE",
    chart3: "#34D399",
    chart4: "#FBBF24",
    chart5: "#F87171",

    /* Sidebar Colors - Dark */
    sidebar: "#343434",
    sidebarForeground: "#FCFCFD",
    sidebarPrimary: "#6366F1",
    sidebarPrimaryForeground: "#FCFCFD",
    sidebarAccent: "#444444",
    sidebarAccentForeground: "#FCFCFD",
    sidebarBorder: "#444444",
    sidebarRing: "#707070",
  },
  radius,
}

export const theme = {
  light: darkTheme,
  dark: darkTheme,
}