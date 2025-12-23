import { Activity, ArrowRight, Bell, Server, Shield, Sparkles, Terminal } from "lucide-react-native";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SkiaGlowBlob } from "@/components/SkiaBlurBlob";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTheme } from "@/theme/useTheme";

import { MetricRing } from "@/components/ui/MetricRing";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LandingScreen() {
	const { colors } = useTheme();

	const features = [
		{
			icon: Activity,
			title: "Real-time Monitoring",
			description: "CPU, memory, disk usage updated every second",
		},
		{
			icon: Bell,
			title: "Smart Alerts",
			description: "Get notified before issues become critical",
		},
		{
			icon: Terminal,
			title: "Container Insights",
			description: "Docker & Kubernetes monitoring built-in",
		},
		{
			icon: Shield,
			title: "Secure by Default",
			description: "End-to-end encryption for all your data",
		},
	];

	return (
		 <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
			
			<View
				style={StyleSheet.absoluteFill}
				pointerEvents='none'>
				<SkiaGlowBlob
					color={colors.glowBlue}
					size={300}
					intensity={0.16}
					style={{ top: -160, left: -160 }}
				/>
				<SkiaGlowBlob
					color={colors.glowGreen}
					size={260}
					intensity={0.12}
					style={{ top: 220, right: -180 }}
				/>
				<SkiaGlowBlob
					color={colors.glowYellow}
					size={240}
					intensity={0.1}
					style={{ bottom: -200, left: 40 }}
				/>
			</View>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={styles.scroll}>
				{/* HEADER */}
				<View style={styles.header}>
					<View style={styles.logoRow}>
						<View style={[styles.logoBox, { backgroundColor: colors.primary + "22" }]}>
							<Server
								size={18}
								color={colors.primary}
							/>
						</View>
						<Text style={[styles.logoText, { color: colors.foreground }]}>ServerPulse</Text>
					</View>

					<Text
						onPress={() => router.push("/(auth)/login")}
						style={{ color: colors.primary, fontWeight: "600" }}>
						Sign In
					</Text>
				</View>

				{/* HERO */}
				<View style={styles.hero}>
					<View style={[styles.badge, { backgroundColor: colors.glass }]}>
						<Sparkles
							size={14}
							color={colors.primary}
						/>
						<Text style={{ color: colors.foreground, fontSize: 12 }}>AI-powered monitoring</Text>
					</View>

					<Text style={[styles.h1, { color: colors.foreground }]}>
						Monitor servers{"\n"}
						<Text style={{ color: colors.primary }}>without the pain</Text>
					</Text>

					<Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
						Real-time insights, smart alerts, and a beautiful interface — built for developers who care about
						reliability.
					</Text>

					{/* PRIMARY CTA */}
					<Pressable
						style={[styles.ctaPrimary, { backgroundColor: colors.primary }]}
						onPress={() => router.push("/(auth)/register")}>
						<Text style={{ color: colors.primaryForeground, fontWeight: "700" }}>Get started free</Text>
						<ArrowRight
							size={18}
							color={colors.primaryForeground}
						/>
					</Pressable>

					{/* SECONDARY CTA */}
					<Pressable
					onPress={()=>{router.push('/(auth)/login')}}
					style={[styles.ctaSecondary, { borderColor: colors.primary }]}>
						<Text style={{ color: colors.primary, fontWeight: "600" }}>Sign In</Text>
					</Pressable>

					<Text style={styles.helperText}>No credit card required</Text>
				</View>

				{/* LIVE PREVIEW CARD */}
				{/* LIVE PREVIEW CARD */}
				<GlassCard >
					<Text style={styles.previewLabel}>Live server preview</Text>

					<View style={styles.serverRow}>
						<View style={[styles.serverIcon, { backgroundColor: colors.statusOnline + "22" }]}>
							<Server
								size={18}
								color={colors.statusOnline}
							/>
						</View>

						<View style={{ flex: 1 }}>
							<Text style={{ color: colors.foreground, fontWeight: "600" }}>api-prod-01</Text>
							<Text style={{ fontSize: 12, color: colors.mutedForeground }}>us-east-1 • Ubuntu</Text>
						</View>

						<View style={[styles.envBadge, { backgroundColor: colors.envProduction + "22" }]}>
							<Text
								style={{
									fontSize: 12,
									color: colors.envProduction,
									fontWeight: "600",
								}}>
								Production
							</Text>
						</View>
					</View>

					<View style={styles.metricRingRow}>
						<MetricRing
							value={45}
							label='CPU'
							size='md'
						/>
						<MetricRing
							value={62}
							label='Memory'
							size='md'
						/>
						<MetricRing
							value={38}
							label='Disk'
							size='md'
						/>
					</View>
				</GlassCard>

				{/* FEATURES */}
				<Text style={[styles.sectionTitle, { color: colors.foreground }]}>Everything you need</Text>

				<View style={styles.featureGrid}>
					{features.map((f) => {
						const Icon = f.icon;
						return (
							<View
								key={f.title}
								style={styles.featureItem}>
								<GlassCard>
									<View
										style={[
											styles.featureIcon,
											{ backgroundColor: colors.primary + "22" },
										]}>
										<Icon
											size={20}
											color={colors.primary}
										/>
									</View>

									<Text style={styles.featureTitle}>{f.title}</Text>
									<Text style={styles.featureDesc}>{f.description}</Text>
								</GlassCard>
							</View>
						);
					})}
				</View>

				{/* FOOTER */}
				<Text style={styles.footer}>Currently only monitoring agent is open source </Text>
			</ScrollView>
		 </SafeAreaView>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		
	},

	scroll: {
		paddingHorizontal: 10,
		paddingBottom: 40,
	},

	header: {
		paddingHorizontal: 16,
		marginTop:5,
	    paddingTop:12,
		paddingBottom: 12,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},

	logoRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},

	logoBox: {
		width: 36,
		height: 36,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},

	logoText: {
		fontSize: 18,
		fontWeight: "700",
	},

	hero: {
		paddingHorizontal: 16,
		alignItems: "center",
		marginBottom: 32,
	},

	badge: {
		flexDirection: "row",
		gap: 6,
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
		marginBottom: 16,
	},

	h1: {
		fontSize: 36,
		fontWeight: "800",
		textAlign: "center",
		marginBottom: 12,
	},

	subtitle: {
		textAlign: "center",
		lineHeight: 22,
		marginBottom: 20,
	},

	cta: {
		flexDirection: "row",
		gap: 8,
		paddingVertical: 14,
		borderRadius: 16,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
	},

	helperText: {
		fontSize: 12,
		marginTop: 6,
		color: "#9CA3AF",
	},

	serverRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 14,
		gap: 10,
	},

	serverIcon: {
		width: 36,
		height: 36,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},

	serverNameRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},

	envBadge: {
		paddingHorizontal: 10,
		paddingVertical: 4,
		borderRadius: 999,
	},
	metricRingRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 12,
		marginTop: 8,
	},

	metricRow: {
		flexDirection: "row",
		gap: 10,
	},

	metricBox: {
		flex: 1,
		paddingVertical: 12,
		borderRadius: 14,
		alignItems: "center",
	},

	sectionTitle: {
		textAlign: "center",
		fontSize: 20,
		fontWeight: "700",
		marginVertical: 20,
	},

	featureGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",

		rowGap: 12,
	},
	featureIcon: {
		width: 40,
		height: 40,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 8,
	},
	featureItem: {
		width: "48%", // perfect 2-column fit
	},

	footer: {
		textAlign: "center",
		fontSize: 12,
		marginTop: 32,
		color: "#9CA3AF",
	},
	previewLabel: {
		fontSize: 11,
		opacity: 0.6,
		marginBottom: 8,
		textTransform: "uppercase",
		letterSpacing: 1,
	},

	ctaPrimary: {
		flexDirection: "row",
		gap: 8,
		paddingVertical: 14,
		borderRadius: 18,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 10,
	},

	ctaSecondary: {
		width: "100%",
		paddingVertical: 12,
		borderRadius: 18,
		borderWidth: 1,
		alignItems: "center",
	},

	featureTitle: {
		fontWeight: "600",
		marginBottom: 4,
	},

	featureDesc: {
		fontSize: 12,
		opacity: 0.7,
		lineHeight: 16,
	},
});
