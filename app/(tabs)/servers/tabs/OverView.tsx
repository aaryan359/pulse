// tabs/OverviewTab.tsx
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricRing } from "@/components/ui/MetricRing";
import { useTheme } from "@/theme/useTheme";
import { ServerSnapshot } from "@/types/server.type";
import { formatUptime } from "@/utils/mock-data";
import { Box, Clock, Cpu, HardDrive, RotateCcw, Trash2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface OverviewTabProps {
	snapshot?: ServerSnapshot | null;
}

export default function OverviewTab({ snapshot }: OverviewTabProps) {
	const { colors } = useTheme();
	{
		!snapshot && <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Waiting for live data…</Text>;
	}
	return (
		<View style={styles.wrap}>
			{/* System Metrics */}
			<GlassCard>
				<View style={styles.headerRow}>
					<Text style={styles.title}>System Metrics</Text>
					{!snapshot && <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Waiting for live data…</Text>}
				</View>

				<View style={styles.rings}>
					<MetricRing
						value={Number(snapshot?.cpuPercent.toFixed(0)) ?? 0}
						label='CPU'
					/>
					<MetricRing
						value={Number(snapshot?.memoryPercent.toFixed(0)) ?? 0}
						label='Memory'
					/>
					<MetricRing
						value={Number(snapshot?.diskPercent.toFixed(0)) ?? 0}
						label='Disk'
					/>
				</View>
			</GlassCard>

			{/* System Info */}
			<GlassCard>
				<Text style={styles.title}>System Info</Text>

				<InfoRow
					icon={<Cpu size={14} />}
					label='Core Count'
					value={`${snapshot?.cpuCores ?? "--"} cores`}
				/>
				<InfoRow
					icon={<Clock size={14} />}
					label='Uptime'
					value={snapshot ? formatUptime(snapshot.uptimeSeconds) : "--"}
				/>
				<InfoRow
					icon={<HardDrive size={14} />}
					label='Agent Version'
					value={`v${ "--"}`}
				/>
				<InfoRow
					icon={<Box size={14} />}
					label='Containers'
					value={`${snapshot?.containerCount ?? "--"}`}
				/>
			</GlassCard>

			{/* Actions */}
			<GlassCard>
				<Text style={styles.title}>Agent Commands</Text>
				<ActionRow
					icon={<RotateCcw size={16} />}
					title='Restart All Containers'
					subtitle='Gracefully restart all containers'
				/>
				<ActionRow
					icon={<Trash2 size={16} />}
					title='Clear Docker Cache'
					subtitle='Remove unused images and volumes'
				/>
			</GlassCard>
		</View>
	);
}

interface InfoRowProps {
	icon: React.ReactNode;
	label: string;
	value: string;
}

function InfoRow({ icon, label, value }: InfoRowProps) {
	const { colors } = useTheme();
	return (
		<View style={styles.infoRow}>
			<View style={styles.infoLeft}>
				{icon}
				<Text style={{ color: colors.mutedForeground }}>{label}</Text>
			</View>
			<Text style={{ color: colors.foreground }}>{value}</Text>
		</View>
	);
}

interface ActionRowProps {
	icon: React.ReactNode;
	title: string;
	subtitle: string;
}

function ActionRow({ icon, title, subtitle }: ActionRowProps) {
	const { colors } = useTheme();
	return (
		<TouchableOpacity
			style={styles.actionRow}
			activeOpacity={0.85}>
			{icon}
			<View style={{ marginLeft: 10 }}>
				<Text style={{ color: colors.foreground, fontWeight: "600" }}>{title}</Text>
				<Text style={{ color: colors.mutedForeground, fontSize: 12 }}>{subtitle}</Text>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	wrap: { paddingHorizontal: 16, gap: 12 },
	title: { fontSize: 14, fontWeight: "600", marginBottom: 12 },
	headerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 12,
	},
	rings: {
		flexDirection: "row",
		justifyContent: "space-around",
	},
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	infoLeft: { flexDirection: "row", gap: 8 },
	actionRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
	},
});
