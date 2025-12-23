import { EnvironmentBadge } from "@/components/ui/EnvironmentBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useTheme } from "@/theme/useTheme";
import { router } from "expo-router";
import { ChevronRight, Filter, Search } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchServers } from "@/redux/slices/server/server.thunk";

import { selectServerLoading, selectServers } from "@/redux/slices/server/server.selectors";
import { Server } from "@/types/server.type";

export default function ServersScreen() {


	const { colors } = useTheme();
	const dispatch = useAppDispatch();

	const servers = useAppSelector(selectServers);
	const loading = useAppSelector(selectServerLoading);

	const [searchQuery, setSearchQuery] = useState("");
	const [envFilter, setEnvFilter] = useState<Server["environment"] | null>(null);


	// Initial fetch
	useEffect(() => {
		dispatch(fetchServers());
	}, []);


	// Pull-to-refresh handler
	const onRefresh = useCallback(async () => {
		await dispatch(fetchServers()).unwrap();
	}, []);

     console.log("servers,",servers)

	// Filter logic
	const filteredServers = servers.filter((server) => {
		const matchesSearch = server.hostname.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesEnv = !envFilter || server.environment === envFilter;

		return matchesSearch && matchesEnv;
	});


	
	return (
		<SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
			<ScrollView
				contentContainerStyle={styles.container}
				refreshControl={
					<RefreshControl
						refreshing={loading}
						onRefresh={onRefresh}
						tintColor={colors.primary}
					/>
				}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={[styles.title, { color: colors.foreground }]}>Servers</Text>
					<Text
						style={{
							color: colors.mutedForeground,
							fontSize: 13,
						}}>
						{servers.length} servers registered
					</Text>
				</View>

				{/* Search */}
				<View style={styles.section}>
					<GlassCard>
						<View style={styles.searchRow}>
							<Search
								size={16}
								color={colors.mutedForeground}
							/>
							<TextInput
								placeholder='Search servers...'
								placeholderTextColor={colors.mutedForeground}
								value={searchQuery}
								onChangeText={setSearchQuery}
								style={[styles.input, { color: colors.foreground }]}
							/>
							<TouchableOpacity style={styles.filterBtn}>
								<Filter
									size={16}
									color={colors.mutedForeground}
								/>
							</TouchableOpacity>
						</View>
					</GlassCard>
				</View>

				{/* Filters */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.filters}>
					{[
						{ key: null, label: "All" },
						{ key: "production", label: "Production" },
						{ key: "staging", label: "Staging" },
						{ key: "dev", label: "Development" },
					].map((f) => {
						const active = envFilter === f.key;

						return (
							<TouchableOpacity
								key={String(f.key)}
								onPress={() => setEnvFilter(f.key as any)}
								style={[
									styles.filterPill,
									{
										backgroundColor: active ? colors.primary : colors.glass,
									},
								]}>
								<Text
									style={{
										fontSize: 12,
										color: active ? colors.primaryForeground : colors.mutedForeground,
										fontWeight: "500",
									}}>
									{f.label}
								</Text>
							</TouchableOpacity>
						);
					})}
				</ScrollView>

				{/* Server list */}
				<View style={styles.list}>
					{filteredServers.map((server) => (
						<GlassCard key={server.id}>
							<TouchableOpacity
								activeOpacity={0.85}
								onPress={() =>
									router.push({
										pathname: "/(tabs)/servers/[serverId]",
										params: {
												serverId: String(server.id),
												status: server.status,
												},
									})
								}>
								<View style={styles.serverRow}>
									<View style={{ flex: 1 }}>
										<StatusBadge
											status={server.status || 'offline'}
											label={server.hostname}
										/>

										<View style={styles.metaRow}>
											<EnvironmentBadge
												environment={server.environment || "development"}
											/>
											<Text
												style={{
													fontSize: 12,
													color: colors.mutedForeground,
												}}>
												{server.os}
											</Text>
										</View>
									</View>

									<ChevronRight
										size={20}
										color={colors.mutedForeground}
									/>
								</View>
							</TouchableOpacity>
						</GlassCard>
					))}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1 },
	container: { paddingBottom: 96 },
	header: { padding: 16 },
	title: { fontSize: 24, fontWeight: "700" },
	section: { paddingHorizontal: 16, marginBottom: 12 },
	searchRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
	},
	input: { flex: 1, fontSize: 14 },
	filterBtn: {
		padding: 6,
		borderRadius: 8,
	},
	filters: {
		paddingHorizontal: 16,
		gap: 8,
		marginBottom: 12,
	},
	filterPill: {
		paddingHorizontal: 14,
		paddingVertical: 6,
		borderRadius: 999,
	},
	list: { paddingHorizontal: 16, gap: 12 },
	serverRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
	},
	metaRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginTop: 4,
	},
	metricsRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginTop: 10,
	},
	metricLabel: {
		fontSize: 12,
		marginRight: 10,
		opacity: 0.7,
	},
	uptime: {
		fontSize: 12,
		opacity: 0.7,
	},
});
