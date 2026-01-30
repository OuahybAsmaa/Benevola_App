// components/common/Input.tsx
import { useState } from "react"
import { View, TextInput, Text, TouchableOpacity, StyleSheet, type TextInputProps } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, borderRadius, spacing, fontSize } from "../../style/theme"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  icon?: keyof typeof Ionicons.glyphMap
  rightIcon?: keyof typeof Ionicons.glyphMap
  onRightIconPress?: () => void
  containerStyle?: any
}

export default function Input({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  secureTextEntry,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const showPasswordToggle = secureTextEntry !== undefined

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? colors.primary : colors.text.secondary}
            style={styles.icon}
          />
        )}
        
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholderTextColor={colors.text.disabled}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...props}
        />
        
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.rightIcon}
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !showPasswordToggle && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
          >
            <Ionicons
              name={rightIcon}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  
  label: {
    fontSize: fontSize.sm,
    color: colors.text.primary,
    marginBottom: spacing.sm,
    fontWeight: "600",
  },
  
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border.medium,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  
  inputFocused: {
    borderColor: colors.primary,
  },
  
  inputError: {
    borderColor: colors.error,
  },
  
  icon: {
    marginRight: spacing.md,
  },
  
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text.primary,
    padding: 0,
  },
  
  inputWithIcon: {
    marginLeft: 0,
  },
  
  rightIcon: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  
  errorText: {
    fontSize: fontSize.sm,
    color: colors.error,
    marginTop: spacing.xs,
  },
})