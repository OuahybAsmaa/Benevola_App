import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function SplashScreen() {
  const [scale] = useState(new Animated.Value(0.5))

  useEffect(() => {
    // Animate logo
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.2,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale }] }]}>
        <Ionicons name="heart" size={96} color="#fff" />
      </Animated.View>

      <Text style={styles.title}>BénévolApp</Text>
      <Text style={styles.subtitle}>Agissez pour votre communauté</Text>

      <View style={styles.loaderContainer}>
        <Ionicons name="reload" size={32} color="#fff" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7B68EE",
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 48,
  },
  loaderContainer: {
    marginTop: 20,
  },
})
