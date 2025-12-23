import { ServerService } from "@/api/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { useTheme } from "@/theme/useTheme";
import { X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ContainerDetailModal({
  visible,
  containerId,
  onClose,
}: {
  visible: boolean;
  containerId: string | null;
  onClose: () => void;
}) {
  const { colors } = useTheme();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!containerId) return;

    ServerService.getContainerDetails(Number(containerId)).then((res) => {
      setData(res.data.data);
    });
  }, [containerId]);

  if (!data) return null;

  return (
    <Modal transparent animationType="slide" visible={visible}>
      <View style={styles.overlay}>
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{data.name}</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={18} color={colors.mutedForeground} />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <GlassCard>
              <Text style={styles.label}>Image</Text>
              <Text style={styles.value}>{data.image}</Text>

              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{data.status}</Text>

              <Text style={styles.label}>CPU</Text>
              <Text style={styles.value}>{data.cpuPercent ?? 0}%</Text>

              <Text style={styles.label}>Memory</Text>
              <Text style={styles.value}>
                {data.memoryUsageMB ?? 0} / {data.memoryLimitMB ?? "--"} MB
              </Text>

              <Text style={styles.label}>Network</Text>
              <Text style={styles.value}>
                ↓ {data.networkRxMB ?? 0} MB · ↑ {data.networkTxMB ?? 0} MB
              </Text>

              <Text style={styles.label}>Last Seen</Text>
              <Text style={styles.value}>
                {new Date(data.lastSeenAt).toLocaleString()}
              </Text>
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  label: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 12,
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
  },
});
