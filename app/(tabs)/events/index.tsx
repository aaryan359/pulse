import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/ui/GlassCard";
import { useTheme } from "@/theme/useTheme";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectEventLoading, selectEvents } from "@/redux/slices/event/event.selector";
import { fetchEvents } from "@/redux/slices/event/event.thunk";
import { Event } from "@/types/event.type";
import { formatTimeAgo } from "@/utils/mock-data";
import { CheckCircle } from "lucide-react-native";

export default function EventsScreen() {
	const { colors } = useTheme();
	const [severity, setSeverity] = useState<Event["severity"] | null>(null);

	const dispatch = useAppDispatch();
	const events = useAppSelector(selectEvents);
	const loading = useAppSelector(selectEventLoading);

	useEffect(() => {
		dispatch(fetchEvents(severity ?? undefined));
	}, [severity]);

	const onRefresh = () => {
		dispatch(fetchEvents(severity ?? undefined));
	};

	const getSeverityColor = (s: Event["severity"]) => {
		switch (s) {
			case "critical":
				return colors.statusOffline;
			case "warning":
				return colors.statusWarning;
			case "info":
				return colors.statusOnline;
		}
	};

	return (
		<SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
			<ScrollView contentContainerStyle={styles.container}>
				{/* Header */}
				<View style={styles.header}>
					<Text style={[styles.title, { color: colors.foreground }]}>Events</Text>
					<Text style={{ color: colors.mutedForeground, fontSize: 13 }}>System history & debugging log</Text>
				</View>

				{/* Filters */}
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					
					contentContainerStyle={styles.filters}>
					{[
						{ key: null, label: "All Events" },
						{ key: "critical", label: "Critical" },
						{ key: "warning", label: "Warning" },
						{ key: "info", label: "Info" },
					].map((f) => {
						const active = severity === f.key;
						const color = f.key ? getSeverityColor(f.key as any) : colors.primary;

						return (
							<TouchableOpacity
								key={String(f.key)}
								onPress={() => setSeverity(f.key as any)}
								style={[
									styles.filterPill,
									{
										backgroundColor: active ? color : `${color}22`,
									},
								]}>
								<Text
									style={{
										fontSize: 12,
										fontWeight: "500",
										color: active ? "#fff" : color,
									}}>
									{f.label}
								</Text>
							</TouchableOpacity>
						);
					})}
				</ScrollView>

				{/* Events */}
				<ScrollView style={styles.list}
          refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={onRefresh}
                tintColor={colors.primary}
              />
            }
        >
					{events.map((event) => {
						const color = getSeverityColor(event.severity);

						return (
							<GlassCard key={event.id}>
								<View style={styles.row}>
									<View style={{ flex: 1 }}>
										<View style={styles.rowBetween}>
											<Text
												style={[
													styles.severity,
													{
														color,
														backgroundColor: `${color}33`,
													},
												]}>
												{event.severity}
											</Text>
											<Text style={styles.time}>
												{formatTimeAgo(event.createdAt)}
											</Text>
										</View>

										<Text style={[styles.message, { color: colors.foreground }]}>
											{event.message}
										</Text>

										<Text style={styles.server}>Server: {event.serverName}</Text>
									</View>
								</View>
							</GlassCard>
						);
					})}
				</ScrollView>

				{/* Empty */}
				{events.length === 0 && (
					<View style={styles.empty}>
						<CheckCircle
							size={40}
							color={colors.statusOnline}
						/>
						<Text style={{ color: colors.mutedForeground, marginTop: 8 }}>No events found</Text>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: { flex: 1 },
	container: { paddingBottom: 96 },

	header: {
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "700",
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

	list: {
		paddingHorizontal: 16,
		gap: 12,
	},

	row: {
		flexDirection: "row",
		gap: 12,
	},
	iconWrap: {
		width: 36,
		height: 36,
		borderRadius: 18,
		alignItems: "center",
		justifyContent: "center",
	},

	rowBetween: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 6,
	},

	severity: {
		fontSize: 13,
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 999,
		fontWeight: "500",
		textTransform: "capitalize",
	},
	time: {
		fontSize: 11,
		opacity: 0.6,
	},

	message: {
		fontSize: 14,
		fontWeight: "500",
		marginBottom: 4,
	},
	server: {
		fontSize: 12,
		opacity: 0.6,
	},

	empty: {
		paddingTop: 64,
		alignItems: "center",
	},
});
