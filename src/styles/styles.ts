// styles.ts
import { Platform, StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#fff",
    marginTop: Platform.OS === "android" || Platform.OS === "ios" ? 12 : 0,
  },
  header: { fontSize: 24, fontWeight: "700", marginBottom: 0 },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
