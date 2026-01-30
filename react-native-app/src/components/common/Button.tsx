// components/common/Button.tsx
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, type ViewStyle, type TextStyle } from "react-native"
import { colors, borderRadius, spacing, fontSize, fontWeight } from "../../style/theme"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline" | "danger"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  icon,
  fullWidth = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    style,
  ]

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    textStyle,
  ]

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.text.inverse : colors.primary} />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: spacing.sm,
  },
  
  // Variants
  button_primary: {
    backgroundColor: colors.primary,
  },
  
  button_secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border.medium,
  },
  
  button_outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  
  button_danger: {
    backgroundColor: colors.error,
  },
  
  // Sizes
  button_small: {
    height: 36,
    paddingHorizontal: spacing.md,
  },
  
  button_medium: {
    height: 48,
    paddingHorizontal: spacing.lg,
  },
  
  button_large: {
    height: 56,
    paddingHorizontal: spacing.xl,
  },
  
  fullWidth: {
    width: "100%",
  },
  
  disabled: {
    opacity: 0.6,
  },
  
  // Text variants
  text: {
    fontWeight: fontWeight.semibold,
  },
  
  text_primary: {
    color: colors.text.inverse,
  },
  
  text_secondary: {
    color: colors.text.primary,
  },
  
  text_outline: {
    color: colors.primary,
  },
  
  text_danger: {
    color: colors.text.inverse,
  },
  
  // Text sizes
  text_small: {
    fontSize: fontSize.sm,
  },
  
  text_medium: {
    fontSize: fontSize.md,
  },
  
  text_large: {
    fontSize: fontSize.lg,
  },
})