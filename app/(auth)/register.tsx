import { router } from "expo-router";
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, Github, Lock, Mail, Server, User } from "lucide-react-native";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/ui/GlassCard";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/slices/auth/auth.thunk";
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

export default function RegisterScreen() {
	const dispatch = useAppDispatch();
	const { loading } = useAppSelector((state) => state.auth);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [agree, setAgree] = useState(false);



	const SignUpWithEmail = async () => {
		if (!name || !email || !password) {
			Toast.show({
				type: "error",
				text1: "Please fill all the inputs",
			});
			return;
		}

		if (!agree) {
			Toast.show({
				type: "error",
				text1: "Please accept terms & conditions",
			});
			return;
		}

		dispatch(registerUser({ name, email, password }));

    setEmail("");
    setName("");
    setPassword("");
    setAgree(false);
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
					<Pressable
						onPress={() => router.back()}
						style={styles.back}>
						<ArrowLeft
							size={18}
							color={colors.mutedForeground}
						/>
						<Text style={{ color: colors.mutedForeground }}>Back</Text>
					</Pressable>

					<View style={styles.center}>
						{/* Logo - Added transparency to primary for the background */}
						<View style={[styles.logo, { backgroundColor: colors.primary + "15" }]}>
							<Server
								size={28}
								color={colors.primary}
							/>
						</View>

						<Text style={[styles.title, { color: colors.foreground }]}>Create your account</Text>
						<Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
							Start monitoring your servers today
						</Text>

						<GlassCard style={styles.card}>
							{/* --- Social Buttons --- */}

							<Pressable style={[styles.socialBtn, { backgroundColor: "#1e293b" }]}>
								<Text style={{ color: "white", fontWeight: "bold", fontSize: 18, marginRight: 8 }}>
									G
								</Text>
								<Text style={{ color: "white", fontWeight: "600" }}>Continue with Google</Text>
							</Pressable>

							{/* GitHub Button (White background with Border) */}
							<Pressable
								style={[
									styles.socialBtn,
									{
										backgroundColor: colors.foreground,
										borderWidth: 1,
										borderColor: colors.border,
									},
								]}>
								<Github
									size={20}
									color='white'
									style={{ marginRight: 8 }}
								/>
								<Text style={{ color: "black", fontWeight: "600" }}>Continue with GitHub</Text>
							</Pressable>

							<Text style={styles.divider}>or continue with email</Text>

							{/* --- Input Fields --- */}

							{/* Full Name */}
							<View style={styles.fieldGroup}>
								<Text style={[styles.label, { color: colors.foreground }]}>Full Name</Text>
								<View
									style={[
										styles.inputContainer,
										{ backgroundColor: colors.input, borderColor: colors.border },
									]}>
									<User
										size={15}
										color={colors.mutedForeground}
									/>
									<TextInput
										placeholder='John Doe'
										placeholderTextColor={colors.mutedForeground}
										style={[styles.input, { color: colors.foreground }]}
										value={name}
										onChangeText={setName}
									/>
								</View>
							</View>

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

							{/* Terms Checkbox */}
							<Pressable
								onPress={() => setAgree(!agree)}
								style={styles.checkboxRow}>
								<View
									style={[
										styles.checkbox,
										agree
											? {
													backgroundColor: colors.primary,
													borderColor: colors.primary,
											  }
											: { borderColor: "#CBD5E1" },
									]}>
									{agree && (
										<Check
											size={12}
											color={colors.primaryForeground}
										/>
									)}
								</View>
								<Text style={styles.checkboxText}>
									I agree to the <Text style={{ color: colors.primary }}>Terms of Service</Text>{" "}
									and <Text style={{ color: colors.primary }}>Privacy Policy</Text>
								</Text>
							</Pressable>

							<Pressable
								disabled={!agree}
								onPress={SignUpWithEmail}
								style={[
									styles.submit,
									{ backgroundColor: colors.primary, opacity: agree ? 1 : 0.5 },
								]}>
								<Text style={{ color: colors.primaryForeground, fontWeight: "700" }}>
									Create Account
								</Text>
								<ArrowRight
									size={18}
									color={colors.primaryForeground}
								/>
							</Pressable>
						</GlassCard>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1 },

	back: { flexDirection: "row", gap: 6, padding: 16, marginTop: 10 },

	center: {
		paddingHorizontal: 20,
		justifyContent: "center",
		paddingBottom: 40,
		minHeight: "85%",
	},

	logo: {
		width: 60,
		height: 60,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "center",
		marginBottom: 20,
	},
	title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 6 },
	subtitle: { fontSize: 14, textAlign: "center", marginBottom: 30, opacity: 0.8 },
	card: { width: "100%" },

	// Social Styles
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

	// Field Styles
	fieldGroup: {
		marginBottom: 15,
	},
	label: {
		fontSize: 14,
		fontWeight: "700",
		marginBottom: 6, // Increased slightly for spacing
	},
	inputContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		paddingHorizontal: 12,
		paddingVertical: 14,
		borderRadius: 12,
		borderWidth: 1,
		// Background and border colors are set inline via the colors object
	},
	input: { flex: 1, fontSize: 15, padding: 0 },

	// Checkbox
	checkboxRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		marginBottom: 20,
		marginTop: 4,
	},
	checkbox: {
		width: 20,
		height: 20,
		borderRadius: 10,
		borderWidth: 1.5,
		alignItems: "center",
		justifyContent: "center",
	},
	checkboxText: { fontSize: 13, opacity: 0.7, color: "#64748B", flex: 1 },

	submit: {
		flexDirection: "row",
		gap: 8,
		paddingVertical: 16,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
	},
});
