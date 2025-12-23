import { ServerService } from "@/api/server"
import { GlassCard } from "@/components/ui/GlassCard"
import { MetricRing } from "@/components/ui/MetricRing"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { useTheme } from "@/theme/useTheme"
import { Container } from "@/types/container.type"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { StyleSheet, Text, View } from "react-native"
import Toast from "react-native-toast-message"
import ContainerDetailModal from "./ContainerModal"

export default function ContainersTab({ serverId }: { serverId: number }) {
  const { colors } = useTheme()
  const [containers, setContainers] = useState<Container[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);


useEffect(() => {
    let mounted = true;

    const loadContainers = async () => {
      try {
        setLoading(true);

        const res = await ServerService.getContainers(serverId);

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
    return (
      <Text style={{ textAlign: "center", color: colors.mutedForeground }}>
        Loading containers…
      </Text>
    )
  }

  return (
    <View style={styles.wrap}>
      {/* Header */}
      <Text style={[styles.count, { color: colors.foreground }]}>
        {containers.length} Containers
      </Text>

      {containers.map((c) => (
        <GlassCard key={c.id}
                    onPress={() => {
            setSelectedContainerId(c.id);
            setShowModal(true);
            }}>
             
          {/* Top row */}
          <View style={styles.topRow}>
            <StatusBadge
              status={ c.status === "running" ? "online" : c.status === "stopped" ? "offline" : "online"   }
              label={c.name}
            />

            {/* Status pill */}
            <View
              style={[
                styles.statusPill,
                {
                  backgroundColor:
                    c.status === "running"
                      ? colors.statusOnline + "22"
                      : colors.statusOffline + "22",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color:
                    c.status === "running"
                      ? colors.statusOnline
                      : colors.statusOffline,
                }}
              >
                {c.status}
              </Text>
            </View>
          </View>

          {/* Image */}
          <Text style={[styles.image, { color: colors.mutedForeground }]}>
            {c.image}
          </Text>

          {/* Bottom row */}
          <View style={styles.bottomRow}>
            <View style={styles.metrics}>
              <MetricRing value={c.cpuPercent ?? 0} size="sm" label="CPU" />
              <MetricRing value={c.memoryUsageMB ?? 0} size="sm" label="MB RAM" />
                            
            </View>

            {/* Actions 
            * TODO: Implement the bottom modal for shoing the detail in and making and websocket connection
            */}
            {/* <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: colors.glassInset },
                ]}
                activeOpacity={0.7}
              >
                <RotateCcw size={16} color={colors.mutedForeground} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: colors.glassInset },
                ]}
                activeOpacity={0.7}
              >
                <Square size={16} color={colors.destructive} />
              </TouchableOpacity>
            </View> */}
          </View>
        </GlassCard>
      ))}

      <ContainerDetailModal
        visible={showModal}
        containerId={selectedContainerId}
        onClose={() => setShowModal(false)}
        />
    </View>
  )
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
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },

  image: {
    fontSize: 12,
    marginTop: 6,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
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
})
