// screens/LoginScreen.refactored.tsx
import { useState } from "react"
import { View, Text, ScrollView, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../hooks/useAuth"
import { useForm } from "../hooks/useForm"
import Input from "../components/common/Input"
import Button from "../components/common/Button"
import { commonStyles } from "../style/common"
import { styles } from '../style/benevole/LoginScreen.style'

interface LoginScreenProps {
  onNavigate: (screen: string) => void
}

interface LoginFormData {
  email: string
  password: string
}

export default function LoginScreen({ onNavigate }: LoginScreenProps) {
  const { login } = useAuth()
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const MAX_ATTEMPTS = 5

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
    // Vérifier si le compte est bloqué
    if (isBlocked) {
      Alert.alert(
        "Compte temporairement bloqué",
        "Trop de tentatives échouées. Veuillez réessayer dans quelques minutes.",
        [{ text: "OK" }]
      )
      return
    }

    // Vérifier le nombre de tentatives
    if (loginAttempts >= MAX_ATTEMPTS) {
      setIsBlocked(true)
      Alert.alert(
        "Compte bloqué",
        "Trop de tentatives de connexion échouées. Veuillez réessayer dans 15 minutes ou contactez le support.",
        [{ text: "OK" }]
      )
      
      // Débloquer après 15 minutes
      setTimeout(() => {
        setIsBlocked(false)
        setLoginAttempts(0)
      }, 15 * 60 * 1000) // 15 minutes
      
      return
    }

    try {
      await login({
        email: values.email.trim(),
        password: values.password,
      })
      
      // Réinitialiser les tentatives en cas de succès
      setLoginAttempts(0)
      setIsBlocked(false)
      
      // La navigation se fait automatiquement via le listener auth global
    } catch (error: any) {
      //console.error("Erreur de connexion:", error)
      
      // Incrémenter le nombre de tentatives échouées
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      
      // Préparer le message d'erreur
      let errorMessage = "Une erreur est survenue. Veuillez réessayer."
      let errorTitle = "Erreur de connexion"
      
      // Détection du type d'erreur
      if (error?.message?.includes("Invalid credentials") || 
          error?.message?.includes("credentials") ||
          error?.message?.includes("incorrect") ||
          error?.status === 401 ||
          error?.statusCode === 401) {
        
        const remainingAttempts = MAX_ATTEMPTS - newAttempts
        
        if (remainingAttempts > 0) {
          errorMessage = `Email ou mot de passe incorrect.\n\nIl vous reste ${remainingAttempts} tentative${remainingAttempts > 1 ? 's' : ''}.`
        } else {
          errorMessage = "Email ou mot de passe incorrect.\n\nDernière tentative avant blocage temporaire."
        }
        
      } else if (error?.message?.includes("Network") || 
                 error?.message?.includes("network") ||
                 error?.message?.includes("Failed to fetch")) {
        errorMessage = "Problème de connexion internet. Vérifiez votre connexion et réessayez."
        errorTitle = "Problème de connexion"
        
      } else if (error?.message?.includes("timeout")) {
        errorMessage = "La connexion a pris trop de temps. Veuillez réessayer."
        errorTitle = "Délai dépassé"
        
      } else if (error?.message?.includes("blocked") || 
                 error?.message?.includes("banned")) {
        errorMessage = "Votre compte a été bloqué. Veuillez contacter le support."
        errorTitle = "Compte bloqué"
      }
      
      // Afficher l'alerte
      Alert.alert(
        errorTitle,
        errorMessage,
        [{ text: "OK" }]
      )
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
            disabled={isSubmitting || isBlocked}
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