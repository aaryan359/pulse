import { toastConfig } from "@/config/toast-config";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { checkAuth } from "@/redux/slices/auth/auth.thunk";
import { store } from "@/redux/store";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";

SplashScreen.preventAutoHideAsync();

function AppContent() {
	const dispatch = useAppDispatch();

	const { isAuthenticated } = useAppSelector((state) => state.auth);

	useEffect(() => {
		if (!isAuthenticated) {
			dispatch(checkAuth());
		}
	}, []);

	const [fontsLoaded, fontError] = useFonts({
		"Inter-Regular": Inter_400Regular,
		"Inter-Medium": Inter_500Medium,
		"Inter-SemiBold": Inter_600SemiBold,
		"Inter-Bold": Inter_700Bold,
	});

	useEffect(() => {
		if (fontsLoaded || fontError) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	if (!fontsLoaded && !fontError) return null;

	return (
		<>
			<Stack screenOptions={{ headerShown: false }}>
				{/* BOTH stacks must always exist */}
				<Stack.Screen name='(auth)' />
				<Stack.Screen name='(tabs)' />
			</Stack>
		</>
	);
}

export default function RootLayout() {
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<ThemeProvider>
				<SafeAreaProvider>
					<Provider store={store}>
						<AppContent />
						<Toast
							config={toastConfig}
							position='top'
							visibilityTime={3000}
							autoHide
						/>
					</Provider>
				</SafeAreaProvider>
			</ThemeProvider>
		</GestureHandlerRootView>
	);
}
