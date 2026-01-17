import { Platform } from "react-native";

export const API_URL = Platform.select({
	ios: "http://192.168.0.101:3000",
	android: "http://192.168.0.101:3000",
	default: "http://192.168.0.101:3000",
});
