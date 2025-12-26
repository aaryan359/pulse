import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { ServerService } from "@/api/server";
import { EnvironmentBadge } from "@/components/ui/EnvironmentBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricRing } from "@/components/ui/MetricRing";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useAutoRefresh } from "@/hooks/useAutoRefresh";
import { useTheme } from "@/theme/useTheme";
import { formatTimeAgo } from "@/utils/mock-data";
import { AlertTriangle, CheckCircle, Package, Server } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { useAppSelector } from "@/redux/hooks";
import { selectRecentEvents } from "@/redux/slices/event/event.selector";
import { selectServers } from "@/redux/slices/server/server.selectors";



export default function DashboardScreen() {
	const { colors } = useTheme();
	const servers = useAppSelector(selectServers);

	const events = useAppSelector(selectRecentEvents);

	const topServers = servers.slice(0, 5);

	const [rateLimitShown, setRateLimitShown] = useState(false);

	const [stats, setStats] = useState({
		onlineServers: 0,
		offlineServers: 0,
		criticalEvents: 0,
		runningContainers: 0,
		avgCpu: 0,
		avgMemory: 0,
	});

	const loadStats = async () => {
		try {
			const res = await ServerService.getstatsOverView();
			const data = res.data;

			setStats({
				onlineServers: data.onlineServers,
				offlineServers: data.offlineServers,
				criticalEvents: data.criticalEvents,
				runningContainers: data.runningContainers,
				avgCpu: data.avgCpuPercent,
				avgMemory: data.avgMemoryPercent,
			});

			setRateLimitShown(false);
		} catch (error: any) {
			if (error?.response?.status === 429 && !rateLimitShown) {
				setRateLimitShown(true);

				Toast.show({
					type: "info",
					text1: "Rate limit reached",
					text2: "Please wait a bit — refreshing too fast",
				});
			}
		}
	};

	useEffect(() => {
		loadStats();
	}, []);

	/* Auto refresh every 30s */
	useAutoRefresh(loadStats, 90000);

	const getIconBackgroundColor = (color: string) => {
		return `${color}33`;
	};

	return (
		<SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
			<ScrollView
				style={styles.container}
				contentContainerStyle={styles.contentContainer}
				showsVerticalScrollIndicator={false}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={[styles.title, { color: colors.foreground }]}>Dashboard</Text>
					<Text style={[styles.subtitle, { color: colors.mutedForeground }]}>System overview</Text>
				</View>

				<View style={styles.content}>
					{/* Quick Stats Grid */}
					<View style={styles.statsGrid}>
						{/* Online Servers */}
						<GlassCard style={styles.statsCard}>
							<View style={styles.statsItem}>
								<View
									style={[
										styles.iconContainer,
										{ backgroundColor: getIconBackgroundColor(colors.statusOnline) },
									]}>
									<Server
										size={20}
										color={colors.statusOnline}
									/>
								</View>
								<View>
									<Text style={[styles.statsValue, { color: colors.foreground }]}>
										{stats.onlineServers}
									</Text>
									<Text style={[styles.statsLabel, { color: colors.mutedForeground }]}>
										Online
									</Text>
								</View>
							</View>
						</GlassCard>

						{/* Offline Servers */}
						<GlassCard style={styles.statsCard}>
							<View style={styles.statsItem}>
								<View
									style={[
										styles.iconContainer,
										{ backgroundColor: getIconBackgroundColor(colors.statusOffline) },
									]}>
									<Server
										size={20}
										color={colors.statusOffline}
									/>
								</View>
								<View>
									<Text style={[styles.statsValue, { color: colors.foreground }]}>
										{stats.offlineServers}
									</Text>
									<Text style={[styles.statsLabel, { color: colors.mutedForeground }]}>
										Offline
									</Text>
								</View>
							</View>
						</GlassCard>

						{/* Critical Events */}
						<GlassCard style={styles.statsCard}>
							<View style={styles.statsItem}>
								<View
									style={[
										styles.iconContainer,
										{ backgroundColor: getIconBackgroundColor(colors.statusWarning) },
									]}>
									<AlertTriangle
										size={20}
										color={colors.statusWarning}
									/>
								</View>
								<View>
									<Text style={[styles.statsValue, { color: colors.foreground }]}>
										{stats.criticalEvents}
									</Text>
									<Text style={[styles.statsLabel, { color: colors.mutedForeground }]}>
										Critical
									</Text>
								</View>
							</View>
						</GlassCard>

						{/* Containers */}
						<GlassCard style={styles.statsCard}>
							<View style={styles.statsItem}>
								<View
									style={[
										styles.iconContainer,
										{ backgroundColor: getIconBackgroundColor(colors.primary) },
									]}>
									<Package
										size={20}
										color={colors.primary}
									/>
								</View>
								<View>
									<Text style={[styles.statsValue, { color: colors.foreground }]}>
										{stats.runningContainers}
									</Text>
									<Text style={[styles.statsLabel, { color: colors.mutedForeground }]}>
										Containers
									</Text>
								</View>
							</View>
						</GlassCard>
					</View>

					{/* System Health */}
					<GlassCard style={styles.sectionCard}>
						<Text style={[styles.sectionTitle, { color: colors.foreground, marginBottom: 16 }]}>
							System Health
						</Text>
						<View style={styles.healthGrid}>
							<MetricRing
								value={stats.avgCpu}
								size='lg'
								label='CPU'
							/>
							<MetricRing
								value={stats.avgMemory}
								size='lg'
								label='Memory'
							/>
							<MetricRing
								value={52}
								size='lg'
								label='Disk'
							/>
						</View>
					</GlassCard>

					{/* Recent Events */}
					<GlassCard style={styles.sectionCard}>
						<View style={styles.sectionHeader}>
							<Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Events</Text>
							<TouchableOpacity>
								<Text style={[styles.viewAll, { color: colors.mutedForeground }]}>View all</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.eventsList}>
							{events.map((event: any) => {
								const isCritical = event.severity === "critical";
								const isWarning = event.severity === "warning";
								const iconColor = isCritical
									? colors.statusOffline
									: isWarning
									? colors.statusWarning
									: colors.statusOnline;
								const bgColor = isCritical
									? `${colors.statusOffline}33`
									: isWarning
									? `${colors.statusWarning}33`
									: `${colors.statusOnline}33`;

								return (
									<View
										key={event.id}
										style={styles.eventItem}>
										<View
											style={[
												styles.eventIconContainer,
												{ backgroundColor: bgColor },
											]}>
											{isCritical || isWarning ? (
												<AlertTriangle
													size={14}
													color={iconColor}
												/>
											) : (
												<CheckCircle
													size={14}
													color={iconColor}
												/>
											)}
										</View>
										<View style={styles.eventContent}>
											<Text
												style={[
													styles.eventMessage,
													{ color: colors.foreground },
												]}
												numberOfLines={1}>
												{event.message}
											</Text>
											<Text
												style={[
													styles.eventMeta,
													{ color: colors.mutedForeground },
												]}>
												{event.serverName} • {formatTimeAgo(event.timestamp)}
											</Text>
										</View>
									</View>
								);
							})}
						</View>
					</GlassCard>

					{/* Server List Preview */}
					<GlassCard style={styles.sectionCard}>
						<View style={styles.sectionHeader}>
							<Text style={[styles.sectionTitle, { color: colors.foreground }]}>Servers</Text>
							<TouchableOpacity>
								<Text style={[styles.viewAll, { color: colors.mutedForeground }]}>View all</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.serversList}>
							{topServers.map((server) => (
								<View
									key={server.id}
									style={styles.serverItem}>
									<View style={styles.serverInfo}>
										<StatusBadge
											status={server.status as "online" | "offline"}
											pulse={server.status === "online"}
										/>

										<View style={styles.serverDetails}>
											<Text
												style={[
													styles.serverName,
													{ color: colors.foreground },
												]}>
												{server.hostname}
											</Text>

											<View style={styles.environmentContainer}>
												<EnvironmentBadge
													environment={server.environment}
													size='sm'
												/>
											</View>
										</View>
									</View>

									{/* Metrics :TODO implment this */}
								</View>
							))}
						</View>
					</GlassCard>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},

	container: {
		flex: 1,
	},
	contentContainer: {
		paddingBottom: 96,
	},
	header: {
		paddingHorizontal: 16,
		paddingTop: 16,
		paddingBottom: 8,
	},
	title: {
		fontSize: 28,
		fontWeight: "bold",
		marginBottom: 4,
	},
	subtitle: {
		fontSize: 14,
	},
	content: {
		paddingHorizontal: 16,
		gap: 16,
	},
	statsGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	statsCard: {
		flex: 1,
		minWidth: "45%",
	},
	statsItem: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	iconContainer: {
		padding: 8,
		borderRadius: 12,
	},
	statsValue: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 2,
	},
	statsLabel: {
		fontSize: 12,
	},
	sectionCard: {
		gap: 16,
		
	},
	sectionHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: "600",
	},
	viewAll: {
		fontSize: 12,
	},
	healthGrid: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
	},
	eventsList: {
		gap: 12,
	},
	eventItem: {
		flexDirection: "row",
		alignItems: "flex-start",
		gap: 12,
	},
	eventIconContainer: {
		padding: 6,
		borderRadius: 8,
		marginTop: 2,
	},
	eventContent: {
		flex: 1,
		minWidth: 0,
	},
	eventMessage: {
		fontSize: 14,
		fontWeight: "500",
		marginBottom: 2,
	},
	eventMeta: {
		fontSize: 12,
	},
	serversList: {
		gap: 12,
	},
	serverItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	serverInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		flex: 1,
	},
	serverDetails: {
		gap: 4,
	},
	serverName: {
		fontSize: 14,
		fontWeight: "500",
		marginBottom: 4,
	},
	environmentContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	serverMetrics: {
		flexDirection: "row",
		gap: 8,
	},
});
