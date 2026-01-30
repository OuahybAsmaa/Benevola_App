import { View, Text, Image, TouchableOpacity} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { styles } from '../style/benevole/WelcomeScreen.style'

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

