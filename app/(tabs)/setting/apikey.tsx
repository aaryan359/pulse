import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GlassCard } from "@/components/ui/GlassCard";
import { useTheme } from "@/theme/useTheme";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createApiKey, fetchApiKeys, revokeApiKeyThunk } from "@/redux/slices/apikey/key.thunk";
import { router } from "expo-router";
import { AlertTriangle, ArrowLeft, Copy, Key, Plus, RotateCcw, Shield, Trash2, X } from "lucide-react-native";
import Toast from "react-native-toast-message";

export default function ApiKeysScreen() {
	const dispatch = useAppDispatch();
	const { keys, loading } = useAppSelector((s) => s.apikey);

	const { colors } = useTheme();

	const [showCreate, setShowCreate] = useState(false);
	const [newKeyName, setNewKeyName] = useState("");

	const [confirmRevoke, setConfirmRevoke] = useState<string | null>(null);

	useEffect(() => {
		dispatch(fetchApiKeys());
	}, []);

	console.log(" keys form backend ", keys);

	const handleCreateKey = async () => {
		const res = await dispatch(createApiKey(newKeyName)).unwrap();

		Toast.show({
			type: "success",
			text1: "API Key created",
			text2: "Copy it now, it won’t be shown again",
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
			text1: "API Key revoked",
		});
		setConfirmRevoke(null);
	};

	return (
		<SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
			<ScrollView contentContainerStyle={styles.container}>
				<TouchableOpacity
					onPress={() => router.back()}
					style={styles.back}>
					<ArrowLeft
						size={18}
						color={colors.primary}
					/>
					<Text style={{ color: colors.mutedForeground }}>Back</Text>
				</TouchableOpacity>
				{/* Header */}
				<View style={styles.header}>
					<View>
						<Text style={[styles.title, { color: colors.foreground }]}>API Keys</Text>
						<Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Manage your agent keys</Text>
					</View>

					<TouchableOpacity
						onPress={() => setShowCreate(true)}
						style={[styles.addBtn, { backgroundColor: colors.primary }]}>
						<Plus
							size={18}
							color={colors.primaryForeground}
						/>
					</TouchableOpacity>
				</View>

				{/* Security notice */}
				<View style={styles.section}>
					<GlassCard>
						<View style={styles.securityRow}>
							<Shield
								size={20}
								color={colors.statusWarning}
							/>
							<View style={{ flex: 1 }}>
								<Text style={[styles.securityTitle, { color: colors.foreground }]}>
									Keep your keys secure
								</Text>
								<Text style={styles.securityText}>
									Never share your API keys or commit them to version control. Rotate keys
									regularly.
								</Text>
							</View>
						</View>
					</GlassCard>
				</View>

				{/* Keys */}
				<View style={styles.list}>
					{keys.map((key) => {
						const active = !key.revoked;

						return (
							<GlassCard key={key.id.toString()}>
								<View style={styles.keyHeader}>
									<View style={styles.keyNameRow}>
										<Key
											size={16}
											color={active ? colors.primary : colors.mutedForeground}
										/>
										<Text style={{ color: colors.foreground, fontWeight: "600" }}>
											{key.name}
										</Text>
									</View>

									<View
										style={[
											styles.statusPill,
											{
												backgroundColor: active
													? `${colors.statusOnline}22`
													: `${colors.statusOffline}22`,
											},
										]}>
										<Text
											style={{
												fontSize: 11,
												color: active
													? colors.statusOnline
													: colors.statusOffline,
											}}>
											{key.status}
										</Text>
									</View>
								</View>

								{/* Key row */}
								<View style={[styles.keyRow, { backgroundColor: colors.muted + "55" }]}>
									<Text style={styles.keyValue}>••••••••••••••••••••••••••••••</Text>

									<TouchableOpacity
										onPress={() =>
											Toast.show({
												type: "info",
												text1: "Coming soon",
											})
										}>
										<Copy
											size={16}
											color={colors.mutedForeground}
										/>
									</TouchableOpacity>
								</View>

								{/* <View style={styles.metaRow}>
									<Text style={styles.metaText}>Created {formatTimeAgo(key.createdAt)}</Text>
									<Text style={styles.metaText}>
										Last used: {key.lastUsed ? formatTimeAgo(key.lastUsed) : "Never"}
									</Text>
								</View> */}

								{active && (
									<View style={styles.actionsRow}>
										<TouchableOpacity style={styles.rotateBtn}>
											<RotateCcw
												size={14}
												color={colors.foreground}
											/>
											<Text style={styles.actionText}>Rotate</Text>
										</TouchableOpacity>

										<TouchableOpacity
											style={styles.revokeBtn}
											onPress={() => setConfirmRevoke(key.id.toString())}>
											<Trash2
												size={14}
												color={colors.statusOffline}
											/>
											<Text style={{ color: colors.statusOffline, fontSize: 12 }}>
												Revoke
											</Text>
										</TouchableOpacity>
									</View>
								)}
							</GlassCard>
						);
					})}
				</View>
			</ScrollView>

			{/* Create modal */}
			<Modal
				transparent
				visible={showCreate}
				animationType='fade'>
				<View style={styles.modalOverlay}>
					<GlassCard style={styles.modal}>
						<View style={styles.modalHeader}>
							<Text style={[styles.modalTitle, { color: colors.foreground }]}>Create API Key</Text>
							<TouchableOpacity onPress={() => setShowCreate(false)}>
								<X
									size={20}
									color={colors.mutedForeground}
								/>
							</TouchableOpacity>
						</View>

						<TextInput
							placeholder='Key name (e.g. Production Agent)'
							placeholderTextColor={colors.mutedForeground}
							value={newKeyName}
							onChangeText={setNewKeyName}
							style={[styles.input, { color: colors.foreground, backgroundColor: colors.muted }]}
						/>

						<TouchableOpacity
							disabled={!newKeyName.trim()}
							onPress={handleCreateKey}
							style={[styles.createBtn, { backgroundColor: colors.primary }]}>
							<Text style={{ color: colors.primaryForeground, fontWeight: "600" }}>Generate Key</Text>
						</TouchableOpacity>
					</GlassCard>
				</View>
			</Modal>

			{/* Revoke modal */}
			<Modal
				transparent
				visible={!!confirmRevoke}
				animationType='fade'>
				<View style={styles.modalOverlay}>
					<GlassCard style={styles.modal}>
						<View style={styles.revokeHeader}>
							<AlertTriangle
								size={22}
								color={colors.statusOffline}
							/>
							<Text style={[styles.modalTitle, { color: colors.foreground }]}>Revoke API Key</Text>
						</View>

						<Text style={styles.revokeText}>
							This action cannot be undone. Any agents using this key will immediately lose access.
						</Text>

						<View style={styles.revokeActions}>
							<TouchableOpacity
								style={styles.cancelBtn}
								onPress={() => setConfirmRevoke(null)}>
								<Text style={{ color: colors.foreground }}>Cancel</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.confirmBtn, { backgroundColor: colors.statusOffline }]}
								onPress={() => handleRevoke(Number(confirmRevoke)!)}>
								<Text style={{ color: "#fff", fontWeight: "600" }}>Revoke Key</Text>
							</TouchableOpacity>
						</View>
					</GlassCard>
				</View>
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safe: {
		flex: 1,
		marginTop: 20,
	},

	container: {
		paddingBottom: 96,
	},
	back: { flexDirection: "row", gap: 6, marginTop: 10 },

	/* Header */
	header: {
		padding: 16,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},

	title: {
		fontSize: 24,
		fontWeight: "700",
	},

	addBtn: {
		width: 42,
		height: 42,
		borderRadius: 21,
		alignItems: "center",
		justifyContent: "center",
	},

	/* Sections */
	section: {
		paddingHorizontal: 16,
		marginBottom: 12,
	},

	list: {
		paddingHorizontal: 16,
		gap: 12,
	},

	/* Security card */
	securityRow: {
		flexDirection: "row",
		gap: 12,
		alignItems: "flex-start",
	},

	securityTitle: {
		fontSize: 14,
		fontWeight: "600",
		marginBottom: 4,
	},

	securityText: {
		fontSize: 12,
		opacity: 0.7,
		lineHeight: 16,
	},

	/* Key card */
	keyHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},

	keyNameRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
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
		paddingVertical: 10,
		borderRadius: 12,
		marginBottom: 8,
	},

	keyValue: {
		flex: 1,
		fontSize: 12,
		fontFamily: "monospace",
		opacity: 0.8,
	},

	metaRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 12,
	},

	metaText: {
		fontSize: 11,
		opacity: 0.6,
	},

	/* Actions */
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
		fontWeight: "500",
	},

	/* Modals */
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		padding: 16,
	},

	modal: {
		padding: 16,
	},

	modalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 12,
	},

	modalTitle: {
		fontSize: 16,
		fontWeight: "600",
	},

	input: {
		height: 44,
		borderRadius: 12,
		paddingHorizontal: 12,
		fontSize: 14,
		marginBottom: 12,
	},

	createBtn: {
		height: 44,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},

	revokeHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		marginBottom: 12,
	},

	revokeText: {
		fontSize: 13,
		opacity: 0.7,
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
		backgroundColor: "rgba(255,255,255,0.08)",
		alignItems: "center",
		justifyContent: "center",
	},

	confirmBtn: {
		flex: 1,
		height: 44,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
	},
});
