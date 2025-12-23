import { TerminalSquare, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EnvironmentBadge } from "@/components/ui/EnvironmentBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { MetricRing } from "@/components/ui/MetricRing";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { useTheme } from "@/theme/useTheme";
import { formatUptime, mockServers, Server } from "@/utils/mock-data";

export default function TerminalScreen() {
  const { colors } = useTheme();
  const [activeServer, setActiveServer] = useState<Server | null>(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
        {/* Header */}
        <View style={{ padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: "700", color: colors.foreground }}>
            Terminal
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 13 }}>
            Connect to a server shell
          </Text>
        </View>

        {/* Server list */}
        <View style={{ paddingHorizontal: 16, gap: 12 }}>
          {mockServers.map((server) => (
            <GlassCard key={server.id}>
              <View style={styles.serverRow}>
                <View style={{ flex: 1 }}>
                  <StatusBadge status={server.status} label={server.hostname} />

                  <View style={styles.metaRow}>
                    <EnvironmentBadge environment={server.environment} />
                    <Text style={{ fontSize: 12, color: colors.mutedForeground }}>
                      {server.os}
                    </Text>
                  </View>

                  <View style={styles.metricsRow}>
                    <MetricRing value={server.metrics.cpu} size="sm" />
                    <Text style={styles.metricLabel}>CPU</Text>

                    <MetricRing value={server.metrics.memory} size="sm" />
                    <Text style={styles.metricLabel}>Mem</Text>

                    {server.status === "online" && (
                      <Text style={styles.uptime}>
                        Up {formatUptime(server.metrics.uptime)}
                      </Text>
                    )}
                  </View>
                </View>

                {/* CONNECT BUTTON */}
                <Pressable
                  disabled={server.status !== "online"}
                  onPress={() => setActiveServer(server)}
                  style={[
                    styles.connectBtn,
                    {
                      backgroundColor:
                        server.status === "online"
                          ? colors.primary
                          : colors.muted,
                    },
                  ]}
                >
                  <TerminalSquare
                    size={16}
                    color={colors.primaryForeground}
                  />
                  <Text style={{ color: colors.primaryForeground }}>
                    Connect
                  </Text>
                </Pressable>
              </View>
            </GlassCard>
          ))}
        </View>
      </ScrollView>

      {/* TERMINAL MODAL */}
      <TerminalModal
        server={activeServer}
        onClose={() => setActiveServer(null)}
      />
    </SafeAreaView>
  );
}
function TerminalModal({
  server,
  onClose,
}: {
  server: Server | null;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<string[]>([
    "Connecting to server...",
    "Authenticated successfully.",
    "Welcome to the terminal.",
  ]);

  if (!server) return null;

  const runCommand = () => {
    if (!input.trim()) return;

    setLogs((prev) => [
      ...prev,
      `$ ${input}`,
      "command output will appear here",
    ]);
    setInput("");
  };

  return (
    <Modal visible animationType="slide">
      <SafeAreaView style={{ flex: 1, backgroundColor: "#020617" }}>
        {/* Header */}
        <View style={styles.terminalHeader}>
          <View>
            <Text style={{ color: "#e5e7eb", fontWeight: "600" }}>
              {server.hostname}
            </Text>
            <Text style={{ color: "#9ca3af", fontSize: 12 }}>
              Connected • {server.os}
            </Text>
          </View>

          <Pressable onPress={onClose}>
            <X size={20} color="#e5e7eb" />
          </Pressable>
        </View>

        {/* Output */}
        <ScrollView
          style={styles.terminalBody}
          contentContainerStyle={{ padding: 12 }}
        >
          {logs.map((line, i) => (
            <Text
              key={i}
              style={{
                color: "#e5e7eb",
                fontFamily: "monospace",
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              {line}
            </Text>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputRow}>
          <Text style={styles.prompt}>$</Text>
          <TextInput
            value={input}
            onChangeText={setInput}
            onSubmitEditing={runCommand}
            placeholder="Enter command"
            placeholderTextColor="#6b7280"
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
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
  connectBtn: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },

  /* Terminal styles */
  terminalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#1f2933",
  },
  terminalBody: {
    flex: 1,
    backgroundColor: "#020617",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#1f2933",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  prompt: {
    color: "#22d3ee",
    marginRight: 6,
    fontFamily: "monospace",
  },
  input: {
    flex: 1,
    color: "#e5e7eb",
    fontFamily: "monospace",
    fontSize: 14,
  },
});
