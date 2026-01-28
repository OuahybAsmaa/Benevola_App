// styles/theme.ts

export const colors = {
  primary: "#7B68EE",
  primaryLight: "#9B8BFF",
  primaryDark: "#5B48CE",
  
  secondary: "#10B981",
  
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
  
  background: "#F9FAFB",
  surface: "#FFFFFF",
  
  text: {
    primary: "#111827",
    secondary: "#6B7280",
    disabled: "#9CA3AF",
    inverse: "#FFFFFF",
  },
  
  border: {
    light: "#F3F4F6",
    medium: "#E5E7EB",
    dark: "#D1D5DB",
  },
  
  category: {
    environnement: "#10B981",
    social: "#3B82F6",
    education: "#F97316",
    sante: "#EF4444",
    culture: "#A855F7",
  },
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
}

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
}

export const fontSize = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  huge: 36,
}

export const fontWeight = {
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
}

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
}

export const theme = {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
}

export type Theme = typeof theme