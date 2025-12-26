import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/ui/GlassCard";
import { useTheme } from "@/theme/useTheme";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
	createApiKey,
	fetchApiKeys,
	revokeApiKeyThunk,
} from "@/redux/slices/apikey/key.thunk";
import { router } from "expo-router";
import {
	AlertTriangle,
	ArrowLeft,
	Copy,
	Key,
	Plus,
	RotateCcw,
	Shield,
	Trash2,
	X,
} from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function ApiKeysScreen() {
  const dispatch = useAppDispatch();
  const { keys } = useAppSelector((s) => s.apikey);
  const { colors } = useTheme();

  const [showCreate, setShowCreate] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchApiKeys());
  }, []);

  const handleCreateKey = async () => {
    const res = await dispatch(createApiKey(newKeyName)).unwrap();

    Toast.show({
      type: "success",
      text1: "API key created",
      text2: "Copied to clipboard. This won’t be shown again.",
    });

    await Clipboard.setStringAsync(res);
    setShowCreate(false);
    setNewKeyName("");
    dispatch(fetchApiKeys());
  };

  const handleRevoke = async (id: number) => {
    await dispatch(revokeApiKeyThunk(id));
    Toast.show({
      type: "success",
      text1: "API key revoked",
    });
    setConfirmRevoke(null);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <ArrowLeft size={18} color={colors.primary} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>API Keys</Text>
            <Text style={styles.subtitle}>Manage your agent access keys</Text>
          </View>

          <TouchableOpacity
            onPress={() => setShowCreate(true)}
            style={[styles.addBtn, { backgroundColor: colors.primary }]}
          >
            <Plus size={18} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>

        {/* Security Notice */}
        <View style={styles.section}>
          <GlassCard>
            <View style={styles.securityRow}>
              <Shield size={20} color={colors.statusWarning} />
              <View style={{ flex: 1 }}>
                <Text style={styles.securityTitle}>Keep your keys secure</Text>
                <Text style={styles.securityText}>
                  Never share API keys or commit them to version control. Rotate
                  keys regularly.
                </Text>
              </View>
            </View>
          </GlassCard>
        </View>

        {/* Keys List */}
        <View style={styles.list}>
          {keys.map((key) => {
            const active = !key.revoked;

            return (
              <GlassCard key={key.id.toString()}>
                <View style={styles.keyHeader}>
                  <View style={styles.keyNameRow}>
                    <Key
                      size={16}
                      color={active ? colors.primary : "#6b7280"}
                    />
                    <Text style={styles.keyName}>{key.name}</Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: active
                          ? "rgba(34,197,94,0.15)"
                          : "rgba(107,114,128,0.15)",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "600",
                        color: active ? "#22c55e" : "#6b7280",
                      }}
                    >
                      {key.status}
                    </Text>
                  </View>
                </View>

                {/* Masked key */}
                <View style={styles.keyRow}>
                  <Text style={styles.keyValue}>•••• •••• •••• ••••</Text>
                  <TouchableOpacity
                    onPress={() =>
                      Toast.show({
                        type: "info",
                        text1: "Key value hidden",
                        text2: "You can only copy it at creation time",
                      })
                    }
                  >
                    <Copy size={16} color="#9ca3af" />
                  </TouchableOpacity>
                </View>

                {active && (
                  <View style={styles.actionsRow}>
                    <TouchableOpacity style={styles.rotateBtn}>
                      <RotateCcw size={14} color="#e5e7eb" />
                      <Text style={styles.actionText}>Rotate</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.revokeBtn}
                      onPress={() => setConfirmRevoke(key.id.toString())}
                    >
                      <Trash2 size={14} color="#ef4444" />
                      <Text style={styles.revokeText}>Revoke</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </GlassCard>
            );
          })}
        </View>
      </ScrollView>

      {/* Create Modal */}
      <Modal transparent visible={showCreate} animationType="fade">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create API Key</Text>
              <TouchableOpacity onPress={() => setShowCreate(false)}>
                <X size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Key name (e.g. Production Agent)"
              placeholderTextColor="#9ca3af"
              value={newKeyName}
              onChangeText={setNewKeyName}
              style={styles.input}
            />

            <TouchableOpacity
              disabled={!newKeyName.trim()}
              onPress={handleCreateKey}
              style={[
                styles.createBtn,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={styles.createBtnText}>Generate Key</Text>
            </TouchableOpacity>
          </GlassCard>
        </View>
      </Modal>

      {/* Revoke Modal */}
      <Modal transparent visible={!!confirmRevoke} animationType="fade">
        <View style={styles.modalOverlay}>
          <GlassCard style={styles.modal}>
            <View style={styles.revokeHeader}>
              <AlertTriangle size={22} color="#ef4444" />
              <Text style={styles.modalTitle}>Revoke API Key</Text>
            </View>

            <Text style={styles.revokeWarning}>
              This action cannot be undone. Any agents using this key will lose
              access immediately.
            </Text>

            <View style={styles.revokeActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setConfirmRevoke(null)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => handleRevoke(Number(confirmRevoke))}
              >
                <Text style={styles.confirmText}>Revoke Key</Text>
              </TouchableOpacity>
            </View>
          </GlassCard>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  container: {
    paddingBottom: 96,
  },

  back: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 8,
  },

  backText: {
    color: "#9ca3af",
    fontSize: 13,
  },

  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#f9fafb",
  },

  subtitle: {
    fontSize: 13,
    color: "#9ca3af",
  },

  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },

  section: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  securityRow: {
    flexDirection: "row",
    gap: 12,
  },

  securityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f9fafb",
    marginBottom: 4,
  },

  securityText: {
    fontSize: 12,
    color: "#9ca3af",
    lineHeight: 16,
  },

  list: {
    paddingHorizontal: 16,
    gap: 12,
  },

  keyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  keyNameRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  keyName: {
    color: "#f9fafb",
    fontWeight: "600",
  },

  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },

  keyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginBottom: 8,
  },

  keyValue: {
    flex: 1,
    fontFamily: "monospace",
    color: "#9ca3af",
    fontSize: 12,
  },

  actionsRow: {
    flexDirection: "row",
    gap: 8,
  },

  rotateBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  revokeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "rgba(239,68,68,0.15)",
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  actionText: {
    fontSize: 12,
    color: "#e5e7eb",
  },

  revokeText: {
    fontSize: 12,
    color: "#ef4444",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 16,
  },

  modal: {
    padding: 16,
    borderRadius: 20,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f9fafb",
  },

  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "#f9fafb",
    marginBottom: 12,
  },

  createBtn: {
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  createBtnText: {
    color: "#fff",
    fontWeight: "600",
  },

  revokeHeader: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 12,
  },

  revokeWarning: {
    fontSize: 13,
    color: "#9ca3af",
    lineHeight: 18,
    marginBottom: 16,
  },

  revokeActions: {
    flexDirection: "row",
    gap: 8,
  },

  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelText: {
    color: "#e5e7eb",
  },

  confirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    alignItems: "center",
    justifyContent: "center",
  },

  confirmText: {
    color: "#fff",
    fontWeight: "600",
  },
});
