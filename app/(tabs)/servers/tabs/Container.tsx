import { ServerService } from "@/api/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricRing } from "@/components/ui/MetricRing";
import { useTheme } from "@/theme/useTheme";
import { Container } from "@/types/container.type";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import ContainerDetailModal from "./ContainerModal";

export default function ContainersTab({ serverId }: { serverId: number }) {
	const { colors } = useTheme();
	const [containers, setContainers] = useState<Container[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null);
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		let mounted = true;

		const loadContainers = async () => {
			try {
				setLoading(true);

				const res = await ServerService.getContainers(serverId);

				console.log(" data  of containers", res.data);

				if (!mounted) return;
				setContainers(res.data.data);
			} catch (err: any) {
				if (!mounted) return;

				if (axios.isAxiosError(err)) {
					const status = err.response?.status;

					if (status === 429) {
						Toast.show({
							type: "info",
							text1: "Too many requests",
							text2: "You are being rate limited. Please try again shortly.",
						});
						return;
					}
				}
			} finally {
				if (mounted) setLoading(false);
			}
		};

		loadContainers();

		return () => {
			mounted = false;
		};
	}, [serverId]);

	if (loading) {
		return <Text style={{ textAlign: "center", color: colors.mutedForeground }}>Loading containers…</Text>;
	}

	function getLifecycleColor(state: string, colors: any) {
		switch (state) {
			case "running":
				return colors.success ?? "#22c55e";
			case "created":
				return colors.warning ?? "#f59e0b";
			case "exited":
			case "dead":
				return colors.destructive ?? "#ef4444";
			default:
				return colors.mutedForeground ?? "#6b7280";
		}
	}

	function getOnlineState(lastSeenAt?: string | null) {
		if (!lastSeenAt) return "offline";
		return Date.now() - new Date(lastSeenAt).getTime() < 60_000 ? "online" : "offline";
	}

	return (
		<View style={styles.wrap}>
			{/* Header */}
			<Text style={[styles.count, { color: colors.foreground }]}>{containers.length} Containers</Text>

		{containers.map((c) => {
  const onlineState = getOnlineState(c.lastSeenAt)
  const lifecycleColor = getLifecycleColor(c.state, colors)

  return (
    <GlassCard
      key={c.id}
      onPress={() => {
        setSelectedContainerId(String(c.id))
        setShowModal(true)
      }}
    >
      {/* Top Row */}
      <View style={styles.topRow}>
        <View style={styles.nameSection}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: lifecycleColor },
            ]}
          />
          <Text style={[styles.containerName, { color: colors.foreground }]}>
            {c.name}
          </Text>
        </View>

        {/* Lifecycle pill */}
        <View
          style={[
            styles.statusPill,
            {
              backgroundColor: lifecycleColor + "22",
              borderColor: lifecycleColor + "44",
              borderWidth: 1,
            },
          ]}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "600",
              color: lifecycleColor,
            }}
          >
            {c.state.toUpperCase()}
          </Text>
        </View>
      </View>

     
        
    

      {/* Docker status text */}
      <Text style={[styles.image, { color: colors.mutedForeground }]}>
        {c.status}
      </Text>

      {/* Metrics */}
      <View style={styles.bottomRow}>
        <View style={styles.metrics}>
          <MetricRing value={c.cpuPercent ?? 0} size="sm" label="CPU" />
          <MetricRing value={c.memoryUsageMB ?? 0} size="sm" label="MB RAM" />
        </View>
      </View>
    </GlassCard>
  )
})}


			<ContainerDetailModal
				visible={showModal}
				containerId={selectedContainerId}
				onClose={() => setShowModal(false)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	wrap: {
		paddingHorizontal: 16,
		gap: 12,
	},

	count: {
		fontSize: 14,
		fontWeight: "600",
	},

	topRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 8,
	},

	nameSection: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		flex: 1,
	},

	statusDot: {
		width: 12,
		height: 12,
		borderRadius: 6,
	},

	containerName: {
		fontSize: 14,
		fontWeight: "600",
		flex: 1,
	},

	statusPill: {
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 999,
	},

	onlineStatusRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 6,
		marginBottom: 6,
	},

	onlineIndicator: {
		width: 8,
		height: 8,
		borderRadius: 4,
	},

	onlineStatusText: {
		fontSize: 11,
		fontWeight: "500",
	},

	image: {
		fontSize: 12,
		marginBottom: 8,
	},

	bottomRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginTop: 8,
	},

	metrics: {
		flexDirection: "row",
		gap: 16,
	},

	metricText: {
		fontSize: 12,
	},

	actions: {
		flexDirection: "row",
		gap: 8,
	},

	actionBtn: {
		width: 34,
		height: 34,
		borderRadius: 999,
		alignItems: "center",
		justifyContent: "center",
	},
});
