import { ServerService } from "@/api/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function getLifecycleColor(state: string) {
	switch (state) {
		case "running":
			return "#22c55e";
		case "created":
			return "#f59e0b";
		case "exited":
		case "dead":
			return "#ef4444";
		default:
			return "#6b7280";
	}
}

function getOnlineState(lastSeenAt?: string | null) {
	if (!lastSeenAt) return "offline";
	return Date.now() - new Date(lastSeenAt).getTime() < 60_000 ? "online" : "offline";
}

export default function ContainerDetailModal({
	visible,
	containerId,
	onClose,
}: {
	visible: boolean;
	containerId: string | null;
	onClose: () => void;
}) {
	const [data, setData] = useState<any>(null);

	useEffect(() => {
		if (!containerId) return;
		ServerService.getContainerDetails(Number(containerId)).then((res) => {
			setData(res.data.data);
		});
	}, [containerId]);

	if (!data) return null;

	const lifecycleColor = getLifecycleColor(data.state);
	const onlineState = getOnlineState(data.lastSeenAt);

	return (
		<Modal
			transparent
			animationType='slide'
			visible={visible}>
			<View style={styles.overlay}>
				<View style={styles.sheet}>
					{/* Header */}
					<View style={styles.header}>
						<View style={{ flex: 1 }}>
							<Text style={styles.title}>{data.name}</Text>
							<Text style={styles.subTitle}>{data.image}</Text>
						</View>

						<TouchableOpacity
							onPress={onClose}
							style={styles.closeBtn}>
							<X
								size={18}
								color='#9ca3af'
							/>
						</TouchableOpacity>
					</View>

					{/* Status row */}
					<View style={styles.statusRow}>
						<View
							style={[
								styles.statusPill,
								{
									backgroundColor: lifecycleColor + "22",
									borderColor: lifecycleColor,
								},
							]}>
							<Text style={{ color: lifecycleColor, fontWeight: "600" }}>{data.state.toUpperCase()}</Text>
						</View>
					</View>

					<ScrollView showsVerticalScrollIndicator={false}>
						{/* Metrics */}
						<GlassCard style={{ marginBottom: 10 }}>
							<Text style={styles.sectionTitle}>Metrics</Text>

							<View style={styles.row}>
								<Text style={styles.label}>CPU</Text>
								<Text style={styles.value}>{data.cpuPercent ?? 0} %</Text>
							</View>

							<View style={styles.row}>
								<Text style={styles.label}>Memory</Text>
								<Text style={styles.value}>
									{data.memoryUsageMB ?? 0} / {data.memoryLimitMB ?? "--"} MB
								</Text>
							</View>

							<View style={styles.row}>
								<Text style={styles.label}>Network</Text>
								<Text style={styles.value}>
									↓ {Number(data.networkRxMB).toFixed(2) ?? 0} MB · ↑{" "}
									{Number(data.networkTxMB).toFixed(2) ?? 0} MB
								</Text>
							</View>
						</GlassCard>

						{/* Details */}
						<GlassCard>
							<Text style={styles.sectionTitle}>Details</Text>

							<View style={styles.row}>
								<Text style={styles.label}>Docker Status</Text>
								<Text style={styles.value}>{data.status}</Text>
							</View>

							<View style={styles.row}>
								<Text style={styles.label}>Last Seen</Text>
								<Text style={styles.value}>{new Date(data.lastSeenAt).toLocaleString()}</Text>
							</View>
						</GlassCard>
					</ScrollView>
				</View>
			</View>
		</Modal>
	);
}
const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.55)",
		justifyContent: "flex-end", // ✅ FIXED
	},

	sheet: {
		backgroundColor: "#0b0b0b", // static dark background
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		padding: 16,
		maxHeight: "85%", // ✅ prevents going to top
	},

	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},

	title: {
		fontSize: 18,
		fontWeight: "700",
		color: "#f9fafb",
	},

	subTitle: {
		fontSize: 12,
		color: "#9ca3af",
		marginTop: 2,
	},

	closeBtn: {
		padding: 6,
	},

	statusRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 14,
	},

	statusPill: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 999,
		borderWidth: 1,
	},

	onlineRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
	},

	dot: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},

	sectionTitle: {
		fontSize: 13,
		fontWeight: "700",
		color: "#e5e7eb",
		marginBottom: 10,
	},

	row: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 13,
	},

	label: {
		fontSize: 13,
		color: "#9ca3af",
	},

	value: {
		fontSize: 13,
		fontWeight: "600",
		color: "#f3f4f6",
	},
});
