import { StyleSheet,Dimensions  } from 'react-native';
const { width, height } = Dimensions.get("window")
export const styles = StyleSheet.create({
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