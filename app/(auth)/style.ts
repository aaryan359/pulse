import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  root: { flex: 1 },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },

  subtitle: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 24,
  },

  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: 12,
  },

  input: {
    flex: 1,
    fontSize: 14,
  },

  button: {
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  footer: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 13,
    color: "#9CA3AF",
  },
})

export default styles;