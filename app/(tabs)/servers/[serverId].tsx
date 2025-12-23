import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ServerService } from "@/api/server";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useTheme } from "@/theme/useTheme";
import { Server, ServerSnapshot } from "@/types/server.type";

import { useServerWebSocket } from "@/hooks/useServerWebSocket";
import axios from "axios";
import { ArrowLeft } from "lucide-react-native";
import Toast from "react-native-toast-message";
import ContainersTab from "./tabs/Container";
import MetricsTab from "./tabs/Metric";
import OverviewTab from "./tabs/OverView";

export default function ServerDetailScreen() {
	const { colors } = useTheme();
	const { serverId, status } = useLocalSearchParams<{ serverId: string; status: string }>();

	const id = Number(serverId);

	const [tab, setTab] = useState<"overview" | "metrics" | "containers">("overview");
	const [server, setServer] = useState<Server | null>(null);
	const [snapshot, setSnapshot] = useState<ServerSnapshot | null>(null);
	const [loading, setLoading] = useState(true);
const [rateLimited, setRateLimited] = useState(false);
	/* ---------- Initial load ---------- */
	useEffect(() => {
		if (!id) return;

		const loadServerData = async () => {
  try {
    setLoading(true);

    const res = await ServerService.getOverview(id);
    const data = res.data.data;

    setServer(data);
    setSnapshot(data.snapshot ?? null);

  }  catch (err: any) {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;

    if (status === 429) {
      setRateLimited(true);

      Toast.show({
        type: "info",
        text1: "Too many requests",
        text2: "You are being rate limited. Live data will continue via WebSocket.",
      });

      // IMPORTANT: do NOT treat as fatal
      return;
    }

    if (status === 404) {
      Toast.show({
        type: "error",
        text1: "Server not found",
      });
      router.back();
      return;
    }
  }

  Toast.show({
    type: "error",
    text1: "Network error",
    text2: "Unable to load server data",
  });
} finally {
  setLoading(false);
}

};


		loadServerData();
	}, [id]);

	/* ---------- Live snapshot via WebSocket ---------- */
	useServerWebSocket(id, (newSnapshot) => {
		setSnapshot(newSnapshot);
	});

	console.log("server data is", server);

	if (loading) {
		return (
			<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
				<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
					<Text style={{ color: colors.mutedForeground }}>Loading server…</Text>
				</View>
			</SafeAreaView>
		);
	}

	if (!server && !loading && !rateLimited) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: colors.destructive }}>Server not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

	const handleBack = () => {
		if (router.canGoBack()) {
			router.back();
		} else {
			router.replace("/(tabs)/servers");
		}
	};

	console.log(" status us", status);

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
			<ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
				{/* Header */}
				<View style={{ padding: 16 }}>
					<TouchableOpacity
						onPress={handleBack}
						style={styles.back}>
						<ArrowLeft
							size={16}
							color={colors.primary}
						/>
						<Text style={{ color: colors.primary, fontWeight: "500" }}>Servers</Text>
					</TouchableOpacity>

					<View style={styles.headerRow}>
						<View>
							<Text style={[styles.title, { color: colors.foreground }]}>  {server?.hostname ?? "Server"}</Text>
							<View style={styles.metaRow}>
								<Text style={styles.metaText}>
									{(server?.environment ?? "--")} • {(server?.os ?? "--")}
								</Text>
							</View>
						</View>

						<StatusBadge status={(status as "online" | "offline") || "offline"} />
					</View>
				</View>

				{/* Tabs */}
				<View style={[styles.tabs, { backgroundColor: colors.glass }]}>
					{["overview", "containers", "metrics"].map((t) => {
						const active = tab === t;
						return (
							<TouchableOpacity
								key={t}
								onPress={() => setTab(t as any)}
								style={[styles.tab, active && { backgroundColor: colors.primary }]}>
								<Text
									style={{
										fontWeight: "600",
										color: active ? colors.primaryForeground : colors.mutedForeground,
									}}>
									{t.charAt(0).toUpperCase() + t.slice(1)}
								</Text>
							</TouchableOpacity>
						);
					})}
				</View>

				{/* Render tab content */}
				{tab === "overview" && (
					<View>
						<OverviewTab
							snapshot={snapshot}
						/>
					</View>
				)}

				{tab === "containers" && <ContainersTab serverId={id} />}

				{tab === "metrics" && <MetricsTab serverId={id} />}
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	back: { flexDirection: "row", gap: 6, marginBottom: 12, zIndex: 10 },
	headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
	title: { fontSize: 24, fontWeight: "700" },
	metaRow: { flexDirection: "row", gap: 8, marginTop: 4 },
	metaText: { fontSize: 12, opacity: 0.7 },
	tabs: {
		flexDirection: "row",
		margin: 16,
		borderRadius: 999,
		padding: 4,
	},
	tab: {
		flex: 1,
		alignItems: "center",
		paddingVertical: 10,
		borderRadius: 999,
	},
	section: { paddingHorizontal: 16, gap: 12 },
	sectionTitle: { fontSize: 14, fontWeight: "600", marginBottom: 12 },
	rings: { flexDirection: "row", justifyContent: "space-around" },
	infoRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	infoLeft: { flexDirection: "row", gap: 8 },
	actionButton: {
		paddingVertical: 14,
		paddingHorizontal: 16,
		borderRadius: 14,
		marginBottom: 12,
	},
	actionLabel: {
		fontSize: 15,
		fontWeight: "600",
	},
	actionDescription: {
		fontSize: 12,
		opacity: 0.85,
		marginTop: 2,
	},
});
