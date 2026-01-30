import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { styles } from '../style/benevole/SplashScreen.style'

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

