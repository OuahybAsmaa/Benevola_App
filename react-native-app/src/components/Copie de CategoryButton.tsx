import { TouchableOpacity, Text, StyleSheet, View } from "react-native"

interface CategoryButtonProps {
  icon: string
  label: string
  isActive: boolean
  onClick: () => void
}

export default function CategoryButton({ icon, label, isActive, onClick }: CategoryButtonProps) {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={[
        styles.button,
        isActive ? styles.activeButton : styles.inactiveButton,
      ]}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999, // rounded-full
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // pour Android
  },
  activeButton: {
    backgroundColor: "#7B68EE", // ta couleur primaire (adapte si besoin)
  },
  inactiveButton: {
    backgroundColor: "#E5E7EB", // bg-gray-100
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeLabel: {
    color: "#FFFFFF",
  },
  inactiveLabel: {
    color: "#374151", // text-gray-700
  },
})