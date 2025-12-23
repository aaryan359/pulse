// tabs/MetricsTab.tsx
import { ServerService } from "@/api/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTheme } from "@/theme/useTheme";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
// @ts-ignore
import { LineChart } from "react-native-svg-charts";

export default function MetricsTab({ serverId }: { serverId: number }) {
	const { colors } = useTheme();
	const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

	  useEffect(() => {
    let mounted = true;

    const loadMetrics = async () => {
      try {
        setLoading(true);
        const res = await ServerService.getMetrics(serverId, "1h");
        if (mounted) setData(res.data.data);
      } catch (err: any) {
        if (err?.__handled) return;
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadMetrics();

    return () => {
      mounted = false;
    };
  }, [serverId]);


	return (
		<View style={{ paddingHorizontal: 16, gap: 12 }}>
			<GlassCard>
				<Text style={{ fontWeight: "600", marginBottom: 12 }}>CPU Usage (1h)</Text>

				<LineChart
					style={{ height: 120 }}
					data={data.map((d) => d.cpuAvg)}
					svg={{ stroke: colors.chart1, strokeWidth: 2 }}
					contentInset={{ top: 20, bottom: 20 }}
				/>
			</GlassCard>

			<GlassCard>
				<Text style={{ fontWeight: "600", marginBottom: 12 }}>Memory Usage (1h)</Text>

				<LineChart
					style={{ height: 120 }}
					data={data.map((d) => d.memoryAvg)}
					svg={{ stroke: colors.chart2, strokeWidth: 2 }}
					contentInset={{ top: 20, bottom: 20 }}
				/>
			</GlassCard>
		</View>
	);
}
