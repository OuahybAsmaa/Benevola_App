import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

interface WelcomeScreenProps {
  onGetStarted: (screen: "login" | "register") => void
}

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require("../../assets/welcome3.jpg")} 
          style={styles.image} 
          resizeMode="cover" 
        />

        <View style={styles.iconContainer}>
          <Ionicons name="heart-outline" size={80} color="#7B68EE" />
        </View>

        <Text style={styles.title}>Faites la différence</Text>

        <Text style={styles.description}>
          Contribuez à votre communauté et créez un impact positif autour de vous.
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={() => onGetStarted("login")}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Commencer</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 80,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  image: {
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: 20,
    marginBottom: 32,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7B68EE",
    textAlign: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 32,
  },
  footer: {
    paddingHorizontal: 24,
  },
  startButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#7B68EE",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#7B68EE",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
})