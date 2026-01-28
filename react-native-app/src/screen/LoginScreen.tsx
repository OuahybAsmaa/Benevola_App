// screens/LoginScreen.refactored.tsx
import { View, Text, ScrollView, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../hooks/useAuth"
import { useForm } from "../hooks/useForm"
import Input from "../components/common/Input"
import Button from "../components/common/Button"
import { colors, spacing, fontSize, fontWeight, borderRadius } from "../styles/theme"
import { commonStyles } from "../styles/common"

interface LoginScreenProps {
  onNavigate: (screen: string) => void
}

interface LoginFormData {
  email: string
  password: string
}

export default function LoginScreen({ onNavigate }: LoginScreenProps) {
  const { login } = useAuth()

  const validateForm = (values: LoginFormData) => {
    const errors: Partial<Record<keyof LoginFormData, string>> = {}

    if (!values.email) {
      errors.email = "L'email est requis"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = "Email invalide"
    }

    if (!values.password) {
      errors.password = "Le mot de passe est requis"
    } else if (values.password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères"
    }

    return errors
  }

  const handleSubmit = async (values: LoginFormData) => {
  try {
    await login({
      email: values.email.trim(),
      password: values.password,
      // Plus de rôle forcé ici !!
    })
    // → Rien ici, la navigation se fait automatiquement via ton listener auth global
  } catch (error) {
    console.error("Erreur de connexion:", error)
    // Optionnel : Alert.alert("Erreur", "Email ou mot de passe incorrect")
  }
}

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit: submitForm,
  } = useForm<LoginFormData>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateForm,
    onSubmit: handleSubmit,
  })

  return (
    <ScrollView style={commonStyles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="heart" size={64} color="#fff" />
        <Text style={styles.headerTitle}>Bon retour !</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.title}>Connexion</Text>

        <View style={styles.inputGroup}>
          <Input
            label="Email"
            placeholder="Votre email"
            value={values.email}
            onChangeText={(text) => handleChange("email", text)}
            onBlur={() => handleBlur("email")}
            error={touched.email ? errors.email : undefined}
            icon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Mot de passe"
            placeholder="Votre mot de passe"
            value={values.password}
            onChangeText={(text) => handleChange("password", text)}
            onBlur={() => handleBlur("password")}
            error={touched.password ? errors.password : undefined}
            icon="lock-closed"
            secureTextEntry
          />

          <Button
            title="Mot de passe oublié ?"
            onPress={() => {}}
            variant="outline"
            size="small"
            style={styles.forgotButton}
          />

          <Button
            title="SE CONNECTER"
            onPress={submitForm}
            variant="primary"
            size="large"
            fullWidth
            loading={isSubmitting}
            disabled={isSubmitting}
          />
        </View>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Pas encore de compte ? </Text>
          <Button
            title="Inscrivez-vous"
            onPress={() => onNavigate("register")}
            variant="outline"
            size="small"
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
  },
  
  header: {
    height: 192,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.semibold,
    color: colors.text.inverse,
    marginTop: spacing.sm,
  },
  
  form: {
    padding: spacing.xxl,
  },
  
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text.primary,
    textAlign: "center",
    marginBottom: spacing.xxxl,
  },
  
  inputGroup: {
    gap: spacing.lg,
  },
  
  forgotButton: {
    alignSelf: "flex-end",
  },
  
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    gap: spacing.sm,
  },
  
  signupText: {
    fontSize: fontSize.base,
    color: colors.text.secondary,
  },
})