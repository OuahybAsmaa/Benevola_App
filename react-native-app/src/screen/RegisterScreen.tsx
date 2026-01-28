import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface RegisterScreenProps {
  onNavigate: (screen: string) => void
}

export default function RegisterScreen({ onNavigate }: RegisterScreenProps) {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [role, setRole] = useState<"benevole" | "organisation" | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) {
      return { width: "0", label: "", color: "#E5E7EB" }
    }
    if (password.length < 6) {
      return { width: "33", label: "Faible", color: "#EF4444" }
    }
    if (password.length < 8) {
      return { width: "66", label: "Moyen", color: "#F97316" }
    }
    if (/[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
      return { width: "100", label: "Fort", color: "#22C55E" }
    }
    return { width: "66", label: "Moyen", color: "#F97316" }
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const isFormValid =
    formData.firstName.length >= 2 &&
    formData.lastName.length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword &&
    role !== null &&
    acceptTerms

  const handleRegister = async () => {
    if (!isFormValid || !role) return

    setIsLoading(true)
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
      })

      // Redirection selon le rôle
      if (role === "organisation") {
        onNavigate("organizer-dashboard")
      } else {
        onNavigate("home")
      }
    } catch (error) {
      console.error("Register error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="heart" size={48} color="#fff" />
        <Text style={styles.headerTitle}>Bienvenue !</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.title}>Créer un compte</Text>

        <View style={styles.inputGroup}>
          {/* First Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#7B68EE" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Votre prénom"
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#7B68EE" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Votre nom"
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
            />
          </View>

          {/* Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#7B68EE" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Votre email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Phone */}
          <View style={styles.inputContainer}>
            <Ionicons name="call" size={20} color="#7B68EE" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Numéro de téléphone (optionnel)"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              keyboardType="phone-pad"
            />
          </View>

          {/* Password */}
          <View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#7B68EE" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mot de passe (min. 6 caractères)"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {formData.password.length > 0 && (
              <View style={styles.passwordStrength}>
                <View style={styles.strengthBar}>
                  <View
                    style={[
                      styles.strengthFill,
                      {
                        width: passwordStrength.width + "%",
                        backgroundColor: passwordStrength.color,
                      },
                    ]}
                  />
                </View>
                {passwordStrength.label !== "" && (
                  <Text style={styles.strengthLabel}>{passwordStrength.label}</Text>
                )}
              </View>
            )}
          </View>

          {/* Confirm Password */}
          <View>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#7B68EE" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmer le mot de passe"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <Text style={styles.errorText}>Les mots de passe ne correspondent pas</Text>
            )}
          </View>

          {/* Role Selection */}
          <View style={styles.roleSection}>
            <Text style={styles.roleTitle}>Vous êtes ?</Text>
            <View style={styles.roleButtons}>
              <TouchableOpacity
                style={[styles.roleButton, role === "benevole" && styles.roleButtonActive]}
                onPress={() => setRole("benevole")}
              >
                {role === "benevole" && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
                <Ionicons name="person-circle" size={48} color={role === "benevole" ? "#7B68EE" : "#D1D5DB"} />
                <Text style={styles.roleButtonTitle}>Bénévole</Text>
                <Text style={styles.roleButtonSubtitle}>Je veux participer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleButton, role === "organisation" && styles.roleButtonActive]}
                onPress={() => setRole("organisation")}
              >
                {role === "organisation" && (
                  <View style={styles.checkmark}>
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  </View>
                )}
                <Ionicons name="business" size={48} color={role === "organisation" ? "#7B68EE" : "#D1D5DB"} />
                <Text style={styles.roleButtonTitle}>Organisation</Text>
                <Text style={styles.roleButtonSubtitle}>Je propose des missions</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms */}
          <TouchableOpacity style={styles.termsContainer} onPress={() => setAcceptTerms(!acceptTerms)}>
            <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
              {acceptTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={styles.termsText}>
              J'accepte les{" "}
              <Text style={styles.termsLink}>conditions d'utilisation</Text>
              {" "}et la{" "}
              <Text style={styles.termsLink}>politique de confidentialité</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.registerButton, (!isFormValid || isLoading) && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>CRÉER MON COMPTE</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Déjà un compte ? </Text>
          <TouchableOpacity onPress={() => onNavigate("login")}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    height: 128,
    backgroundColor: "#7B68EE",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginTop: 4,
  },
  form: {
    padding: 24,
    paddingBottom: 96,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    marginBottom: 24,
  },
  inputGroup: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  eyeIcon: {
    padding: 4,
  },
  passwordStrength: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },
  strengthBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 3,
  },
  strengthLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
    marginLeft: 4,
  },
  roleSection: {
    marginTop: 8,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: "row",
    gap: 12,
  },
  roleButton: {
    flex: 1,
    height: 144,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    position: "relative",
  },
  roleButtonActive: {
    borderColor: "#7B68EE",
    backgroundColor: "#F5F3FF",
  },
  checkmark: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    backgroundColor: "#7B68EE",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  roleButtonTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 8,
  },
  roleButtonSubtitle: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    textAlign: "center",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: "#7B68EE",
    borderColor: "#7B68EE",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  termsLink: {
    color: "#7B68EE",
    textDecorationLine: "underline",
  },
  registerButton: {
    height: 48,
    backgroundColor: "#7B68EE",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    fontSize: 14,
    color: "#6B7280",
  },
  loginLink: {
    fontSize: 14,
    color: "#7B68EE",
    fontWeight: "bold",
  },
})