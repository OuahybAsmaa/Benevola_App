import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  scrollView: { flex: 1 },
  avatarSection: { alignItems: "center", marginVertical: 32 },
  
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#7B68EE",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "white", fontSize: 48, fontWeight: "bold" },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7B68EE",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 12,
    gap: 8,
  },
  changePhotoText: { color: "white", fontSize: 14, fontWeight: "600" },
  formGroup: { paddingHorizontal: 24, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#111", marginBottom: 8 },
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  bottomButtons: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: { fontSize: 16, fontWeight: "600", color: "#666" },
  saveButton: {
    flex: 1,
    backgroundColor: "#7B68EE",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: { color: "white", fontSize: 16, fontWeight: "600" },
  
avatarImage: {
  width: 120,
  height: 120,
  borderRadius: 60,          // disque parfait (cercle)
  borderWidth: 3,
  borderColor: "#7B68EE",    // bordure violet quand il y a une photo
},

avatarEmptyPlaceholder: {
  width: 120,
  height: 120,
  borderRadius: 60,          // disque parfait même sans photo
  backgroundColor: "#ffffff", // blanc pur (tu peux mettre "#f9fafb" pour matcher le fond)
  borderWidth: 2,
  borderColor: "#d1d5db",     // bordure grise très légère (optionnel)
  // Si tu veux vraiment 100% blanc sans bordure : borderWidth: 0
},
})