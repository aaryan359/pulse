import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/ui/GlassCard";
import { useTheme } from "@/theme/useTheme";
import { mockThresholds } from "@/utils/mock-data";

import { useThemeSwitch } from "@/theme/useThemeSwitch";
import { router } from "expo-router";
import { Bell, ChevronRight, CreditCard, FileText, Gauge, HelpCircle, KeySquare, LogOut, Moon, Sun, User } from "lucide-react-native";
import Toast from "react-native-toast-message";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/slices/user/user.selector";
import { fetchCurrentUser } from "@/redux/slices/user/user.thunk";

export default function SettingsScreen() {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectCurrentUser);

	useEffect(() => {
		dispatch(fetchCurrentUser());
	}, []);
	const { colors } = useTheme();
	const { isDarkMode, themePreference, toggleTheme } = useThemeSwitch();

	const handleToggleTheme = () => {
		toggleTheme();
	};

	return (
		<SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
			<ScrollView contentContainerStyle={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={[styles.title, { color: colors.foreground }]}>Settings</Text>
					<Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Manage your account</Text>
				</View>

				{/* ACCOUNT */}
				<GlassCard>
					<Text style={styles.sectionLabel}>ACCOUNT</Text>

					<SettingRow
						icon={
							<User
								size={18}
								color={colors.mutedForeground}
							/>
						}
						title='Profile'
						subtitle={user?.email || "Loading..."}
					/>

					{/* TODO:
					
					<SettingRow
						icon={
							<Shield
								size={18}
								color={colors.mutedForeground}
							/>
						}
						title='Security'
						subtitle='Password, 2FA'
					/> */}

					<SettingRow
						icon={
							<CreditCard
								size={18}
								color={colors.mutedForeground}
							/>
						}
						title='Subscription'
						subtitle={user?.subscribed ? "Pro Plan" : "Free Plan"}
						subtitleColor={user?.subscribed ? colors.statusOnline : colors.mutedForeground}
					/>
				</GlassCard>

				<GlassCard>
					<Text style={styles.sectionLabel}>API KEYS</Text>
					<TouchableOpacity
						onPress={() => {
							router.push("/(tabs)/setting/apikey");
						}}
						style={styles.row}
						activeOpacity={0.85}>
						<View style={styles.rowLeft}>
							<KeySquare
								size={18}
								color={colors.mutedForeground}
							/>

							<Text style={[styles.rowTitle, { color: colors.foreground }]}>Manage Api keys</Text>
						</View>
						<ChevronRight
							size={16}
							color={colors.mutedForeground}
						/>
					</TouchableOpacity>
				</GlassCard>

				{/* PREFERENCES */}
				<GlassCard>
					<Text style={styles.sectionLabel}>PREFERENCES</Text>

					<SettingRow
						icon={
							<Bell
								size={18}
								color={colors.mutedForeground}
							/>
						}
						title='Notifications'
					/>

					<TouchableOpacity
						onPress={handleToggleTheme}
						style={styles.row}
						activeOpacity={0.85}>
						<View style={styles.rowLeft}>
							{isDarkMode ? (
								<Moon
									size={18}
									color={colors.mutedForeground}
								/>
							) : (
								<Sun
									size={18}
									color={colors.mutedForeground}
								/>
							)}
							<Text style={[styles.rowTitle, { color: colors.foreground }]}>Appearance</Text>
						</View>

						<Text style={styles.rowRight}>
							{themePreference === "system" ? "System" : isDarkMode ? "Dark" : "Light"}
						</Text>
					</TouchableOpacity>
				</GlassCard>

				{/* THRESHOLDS */}
				<GlassCard>
					<View style={styles.thresholdHeader}>
						<Text style={styles.sectionLabel}>THRESHOLDS</Text>
						<View style={styles.systemPill}>
							<Text style={styles.systemPillText}>System defaults</Text>
						</View>
					</View>

					{mockThresholds.map((t) => (
						<View
							key={t.id}
							style={styles.thresholdRow}>
							<View style={styles.rowLeft}>
								<Gauge
									size={16}
									color={colors.mutedForeground}
								/>
								<Text style={[styles.rowTitle, { color: colors.foreground }]}>{t.name}</Text>
							</View>

							<Text style={styles.thresholdValue}>
								{t.metric.toUpperCase()} {t.operator} {t.value}%
							</Text>
						</View>
					))}

					<Text style={styles.thresholdNote}>Custom thresholds coming soon</Text>
				</GlassCard>

				{/* SUPPORT */}
				<GlassCard>
					<Text style={styles.sectionLabel}>SUPPORT</Text>

					<SettingRow
						icon={
							<HelpCircle
								size={18}
								color={colors.mutedForeground}
							/>
						}
						title='Help & Support'
					/>

					<SettingRow
						icon={
							<FileText
								size={18}
								color={colors.mutedForeground}
							/>
						}
						title='Documentation'
					/>
				</GlassCard>

				{/* LOGOUT */}
				<TouchableOpacity
					onPress={() => {
						Toast.show({
							type: "success",
							text1: "Log out succesfully",
						});
					}}
					activeOpacity={0.85}
					style={[styles.logoutBtn, { borderColor: colors.statusOffline }]}>
					<LogOut
						size={18}
						color={colors.statusOffline}
					/>
					<Text style={[styles.logoutText, { color: colors.statusOffline }]}>Sign Out</Text>
				</TouchableOpacity>

				{/* VERSION */}
				<Text style={styles.version}>ServerPulse v1.0.0</Text>
			</ScrollView>
		</SafeAreaView>
	);
}

/* -------------------------------------------------------------------------- */
/*                                   ROW                                      */
/* -------------------------------------------------------------------------- */

function SettingRow({ icon, title, subtitle, subtitleColor }: { icon: React.ReactNode; title: string; subtitle?: any; subtitleColor?: string }) {
	const { colors } = useTheme();

	return (
		<TouchableOpacity
			style={styles.row}
			activeOpacity={0.85}>
			<View style={styles.rowLeft}>
				{icon}
				<View>
					<Text style={[styles.rowTitle, { color: colors.foreground }]}>{title}</Text>
					{subtitle && (
						<Text style={[styles.rowSubtitle, { color: subtitleColor ?? colors.mutedForeground }]}>
							{subtitle}
						</Text>
					)}
				</View>
			</View>

			<ChevronRight
				size={16}
				color={colors.mutedForeground}
			/>
		</TouchableOpacity>
	);
}

/* -------------------------------------------------------------------------- */
/*                                   STYLES                                   */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
	safe: { flex: 1 },

	container: {
		paddingBottom: 96,
		paddingHorizontal: 16,
		gap: 16,
	},

	header: {
		paddingTop: 16,
		paddingBottom: 8,
	},

	title: {
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 4,
	},

	sectionLabel: {
		fontSize: 11,
		letterSpacing: 1,
		color: "#9ca3af", // neutral gray
		marginBottom: 8,
		fontWeight: "700",
	},

	row: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingVertical: 12,
		borderRadius: 14,
	},
	thresholdRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },

	rowLeft: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},

	rowTitle: {
		fontSize: 14,
		fontWeight: "500",
	},

	rowSubtitle: {
		fontSize: 12,
		marginTop: 2,
		color: "#9ca3af",
	},

	rowRight: {
		fontSize: 12,
		color: "#9ca3af",
	},

	thresholdHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},

	systemPill: {
		paddingHorizontal: 8,
		paddingVertical: 5,
		borderRadius: 999,
		backgroundColor: "#1f2933",
	},

	systemPillText: {
		fontSize: 11,
		color: "#9ca3af",
		fontWeight: "500",
	},

	thresholdValue: {
		fontSize: 12,
		fontFamily: "monospace",
		color: "#9ca3af",
	},

	thresholdNote: {
		fontSize: 11,
		color: "#6b7280",
		marginTop: 6,
	},
	logoutBtn: {
		flexDirection: "row",
		gap: 8,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 14,
		borderRadius: 20,
		borderWidth: 1,
		backgroundColor: "rgba(239,68,68,0.08)", // subtle red tint
	},

	logoutText: {
		fontSize: 14,
		fontWeight: "600",
	},

	version: {
		textAlign: "center",
		fontSize: 11,
		color: "#6b7280",
		marginTop: 8,
	},
});
