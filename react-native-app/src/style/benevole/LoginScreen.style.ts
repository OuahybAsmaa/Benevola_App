import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight} from "../../style/theme"
export const styles = StyleSheet.create({
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