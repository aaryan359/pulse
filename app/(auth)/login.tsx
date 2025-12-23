import { router } from "expo-router";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Github, Lock, Mail, Server } from "lucide-react-native";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/ui/GlassCard";
import { PulseSpinner } from "@/components/ui/PulseSpinner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { loginUser } from "@/redux/slices/auth/auth.thunk";
import Toast from "react-native-toast-message";

const colors = {
	background: "#000000ff",
	foreground: "#E5E7EB",
	card: "rgba(38,47,66,0.6)",
	cardForeground: "#F1F3F9",
	popover: "rgba(33,40,57,0.9)",
	popoverForeground: "#F1F3F9",
	primary: "#3B82F6",
	primaryForeground: "#0D1521",
	secondary: "#2C3649",
	secondaryForeground: "#F1F3F9",
	muted: "#364054",
	mutedForeground: "#9CA3AF",
	accent: "#22D3EE",
	accentForeground: "#F1F3F9",
	destructive: "#EF4444",
	destructiveForeground: "#F1F3F9",
	border: "rgba(72,84,109,0.5)",
	input: "#2C3649",
};

export default function LoginScreen() {
	const dispatch = useAppDispatch();
	const { loading, isAuthenticated, error } = useAppSelector((state) => state.auth);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);


	const LoginWithEmail = async () => {
		{
			loading && (
				<View style={styles.loaderOverlay}>
					<PulseSpinner />
				</View>
			);
		}

		console.log(" dsdadasdasd screen ");
		
		if (!email || !password) {
			Toast.show({
				type: "error",
				text1: "Please fill all the inputs",
			});
			return;
		}

		

		dispatch(loginUser({ email, password }));
	};

	return (
		<SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<ScrollView
					contentContainerStyle={{ flexGrow: 1 }}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps='handled'>
					{/* Back */}
					<Pressable
						onPress={() => router.back()}
						style={styles.back}>
						<ArrowLeft
							size={18}
							color={colors.primary}
						/>
						<Text style={{ color: colors.primary, fontWeight: "700" }}>Back</Text>
					</Pressable>

					<View style={styles.center}>
						{/* Logo */}
						<View style={[styles.logo, { backgroundColor: colors.primary + "22" }]}>
							<Server
								size={28}
								color={colors.primary}
							/>
						</View>

						<Text style={[styles.title, { color: colors.foreground }]}>Welcome back</Text>
						<Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
							Sign in to continue to ServerPulse
						</Text>

						<GlassCard style={styles.card}>
							{/* Google Button */}
							<Pressable 
							onPress={()=>{
								 Toast.show({
									type: "info",
									text1: "Coming Soon",
									text2:"	Please wait or implement by yourself we are open source"
								});
							}}
							style={[styles.socialBtn, { backgroundColor: "#1e293b" }]}>
								{/* Simulated Google G since Lucide doesn't have it */}
								<Text style={{ color: "white", fontWeight: "bold", fontSize: 18, marginRight: 8 }}>
									G
								</Text>
								<Text style={{ color: "white", fontWeight: "600" }}>Continue with Google</Text>
							</Pressable>

							{/* GitHub Button */}
							<Pressable
							
							onPress={()=>{
								 Toast.show({
									type: "info",
									text1: "Coming Soon",
									text2:"	Please wait or implement by yourself we are open source"
								});
							}}
							style={[styles.socialBtn, { backgroundColor: "white" }]}>
								<Github
									size={20}
									color='black'
									style={{ marginRight: 8 }}
								/>
								<Text style={{ color: "black", fontWeight: "600" }}>Continue with GitHub</Text>
							</Pressable>

							<Text style={styles.divider}>or continue with email</Text>

							{/* Email */}
							<View style={styles.fieldGroup}>
								<Text style={[styles.label, { color: colors.foreground }]}>Email</Text>
								<View
									style={[
										styles.inputContainer,
										{ backgroundColor: colors.input, borderColor: colors.border },
									]}>
									<Mail
										size={15}
										color={colors.mutedForeground}
									/>
									<TextInput
										placeholder='xyz@gmail.com'
										placeholderTextColor={colors.mutedForeground}
										style={[styles.input, { color: colors.foreground }]}
										value={email}
										onChangeText={setEmail}
										keyboardType='email-address'
										autoCapitalize='none'
									/>
								</View>
							</View>

							{/* Password */}
							<View style={styles.fieldGroup}>
								<Text style={[styles.label, { color: colors.foreground }]}>Password</Text>
								<View
									style={[
										styles.inputContainer,
										{ backgroundColor: colors.input, borderColor: colors.border },
									]}>
									<Lock
										size={15}
										color={colors.mutedForeground}
									/>
									<TextInput
										placeholder='••••••••'
										placeholderTextColor={colors.mutedForeground}
										secureTextEntry={!showPassword}
										style={[styles.input, { color: colors.foreground }]}
										value={password}
										onChangeText={setPassword}
									/>
									<Pressable onPress={() => setShowPassword(!showPassword)}>
										{showPassword ? (
											<EyeOff
												size={18}
												color={colors.mutedForeground}
											/>
										) : (
											<Eye
												size={18}
												color={colors.mutedForeground}
											/>
										)}
									</Pressable>
								</View>
								<Text
									style={{
										fontSize: 12,
										color: colors.mutedForeground,
										marginTop: 6,
										marginLeft: 4,
									}}>
									Must be at least 8 characters
								</Text>
							</View>

							<Pressable
								onPress={LoginWithEmail}
								style={[styles.submit, { backgroundColor: colors.primary }]}>
								<Text style={{ color: colors.primaryForeground, fontWeight: "700" }}>Sign In</Text>
								<ArrowRight
									size={18}
									color={colors.primaryForeground}
								/>
							</Pressable>

							<Text style={styles.footerText}>
								Don’t have an account?{" "}
								<Text
									onPress={() => router.replace("/(auth)/register")}
									style={{ color: colors.primary, fontWeight: "600" }}>
									Sign up
								</Text>
							</Text>
						</GlassCard>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1 },
	back: {
		flexDirection: "row",
		gap: 5,
		padding: 16,
		marginTop: 10,
	},
	loaderOverlay: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0,0,0,0.4)",
		justifyContent: "center",
		alignItems: "center",
	},

	center: {
		// Removed flex: 1 to let ScrollView determine height
		paddingHorizontal: 20,
		justifyContent: "center",
		paddingBottom: 40,
		minHeight: "80%", // Ensures content stays centered on tall screens
	},
	logo: {
		width: 60,
		height: 60,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
		alignSelf: "center",
	},
	title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 6 },
	subtitle: { fontSize: 14, textAlign: "center", marginBottom: 30, opacity: 0.8 },
	card: { width: "100%" },

	socialBtn: {
		flexDirection: "row",
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 12,
	},
	divider: {
		textAlign: "center",
		fontSize: 12,
		opacity: 0.5,
		marginVertical: 16,
		color: "#888",
	},

	fieldGroup: {
		marginBottom: 15,
	},
	label: {
		marginLeft: 2,
		fontSize: 14,
		fontWeight: "700",
		marginBottom: 4,
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingHorizontal: 8,
		paddingVertical: 14, // Added vertical padding for consistency
		borderRadius: 12,
		borderWidth: 1,
		backgroundColor: "rgba(255,255,255,0.05)",
	},
	input: { flex: 1, fontSize: 15, padding: 0 },

	submit: {
		flexDirection: "row",
		gap: 8,
		paddingVertical: 16,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 8,
	},
	footerText: {
		marginTop: 20,
		fontSize: 14,
		textAlign: "center",
		opacity: 0.7,
		color: "#aaa",
	},
});
