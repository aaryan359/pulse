import { TerminalSquare, X } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TerminalService } from "@/api/terminal";
import { EnvironmentBadge } from "@/components/ui/EnvironmentBadge";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { WS_URL } from "@/config/ws";
import { useAppSelector } from "@/redux/hooks";
import { selectServerLoading, selectServers } from "@/redux/slices/server/server.selectors";
import { useTheme } from "@/theme/useTheme";
import { Server } from "@/types/server.type";

export default function TerminalScreen() {
	const { colors } = useTheme();
	const servers = useAppSelector(selectServers);
	const loading = useAppSelector(selectServerLoading);

	const [terminalSession, setTerminalSession] = useState<{
		sessionId: string;
		wsUrl: string;
	} | null>(null);

	const [activeServer, setActiveServer] = useState<Server | null>(null);

	const connectToServer = async (server: Server) => {
		const res = await TerminalService.terminalsessionstart(server.id.toString());

		setTerminalSession({
			sessionId: res.data.session_id,
			wsUrl: res.data.ws_url,
		});

		setActiveServer(server);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
			<ScrollView contentContainerStyle={{ paddingBottom: 96 }}>
				{/* Header */}
				<View style={{ padding: 16 }}>
					<Text
						style={{
							fontSize: 24,
							fontWeight: "700",
							color: colors.foreground,
						}}>
						Terminal
					</Text>
					<Text style={{ color: colors.mutedForeground, fontSize: 13 }}>Connect to a server shell</Text>
				</View>

				{loading && (
					<Text
						style={{
							textAlign: "center",
							color: colors.mutedForeground,
							marginTop: 40,
						}}>
						Loading servers…
					</Text>
				)}

				{/* Server list */}

				{!loading && (
					<View style={{ paddingHorizontal: 16, gap: 12 }}>
						{servers.map((server) => (
							<GlassCard key={server.id}>
								<View style={styles.serverRow}>
									<View style={{ flex: 1 }}>
										<StatusBadge
											status={(server.status as "online") || "offline"}
											label={server.hostname}
										/>

										<View style={styles.metaRow}>
											<EnvironmentBadge environment={server.environment} />
											<Text
												style={{
													fontSize: 12,
													color: colors.mutedForeground,
												}}>
												{server.os ?? "--"}
											</Text>
										</View>
									</View>

									{/* CONNECT BUTTON */}
									<Pressable
										disabled={server.status !== "online"}
										onPress={() => connectToServer(server)}
										style={[
											styles.connectBtn,
											{
												backgroundColor:
													server.status === "online"
														? colors.primary
														: colors.muted,
												opacity: server.status === "online" ? 1 : 0.6,
											},
										]}>
										<TerminalSquare
											size={16}
											color={colors.primaryForeground}
										/>
										<Text style={{ color: colors.primaryForeground }}>Connect</Text>
									</Pressable>
								</View>
							</GlassCard>
						))}
						{!servers.length && (
							<Text
								style={{
									textAlign: "center",
									color: colors.mutedForeground,
									marginTop: 40,
								}}>
								No servers registered
							</Text>
						)}
					</View>
				)}
			</ScrollView>

			{/* TERMINAL MODAL */}
			<TerminalModal
				server={activeServer}
				session={terminalSession}
				onClose={() => {
					setActiveServer(null);
					setTerminalSession(null);
				}}
			/>
		</SafeAreaView>
	);
}

// ======================== ANSI PARSER ========================

interface AnsiSegment {
  text: string;
  style: {
    color?: string;
    backgroundColor?: string;
    bold?: boolean;
    dim?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

class AnsiParser {
  private static ANSI_COLORS: { [key: number]: string } = {
    30: '#000000', 31: '#e06c75', 32: '#98c379', 33: '#e5c07b',
    34: '#61afef', 35: '#c678dd', 36: '#56b6c2', 37: '#abb2bf',
    90: '#5c6370', 91: '#e06c75', 92: '#98c379', 93: '#e5c07b',
    94: '#61afef', 95: '#c678dd', 96: '#56b6c2', 97: '#ffffff',
    // Background colors
    40: '#000000', 41: '#e06c75', 42: '#98c379', 43: '#e5c07b',
    44: '#61afef', 45: '#c678dd', 46: '#56b6c2', 47: '#abb2bf',
  };

  static parse(text: string): AnsiSegment[] {
    const segments: AnsiSegment[] = [];
    let currentStyle: AnsiSegment['style'] = {};
    
    // Remove common control sequences
    text = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\x1b\[\?2004[hl]/g, '') // bracketed paste mode
      .replace(/\x1b\]0;.*?\x07/g, '') // set window title
      .replace(/\x1b\[K/g, '') // clear to end of line
      .replace(/\x1b\[\d*[ABCDEFGJKST]/g, ''); // cursor movement

    const ansiRegex = /\x1b\[([0-9;]*)m/g;
    let lastIndex = 0;
    let match;

    while ((match = ansiRegex.exec(text)) !== null) {
      // Add text before this escape sequence
      if (match.index > lastIndex) {
        const textBefore = text.substring(lastIndex, match.index);
        if (textBefore) {
          segments.push({ text: textBefore, style: { ...currentStyle } });
        }
      }

      // Parse the escape sequence
      const codes = match[1] ? match[1].split(';').map(Number) : [0];
      currentStyle = this.applyAnsiCodes(codes, currentStyle);
      
      lastIndex = ansiRegex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remaining = text.substring(lastIndex);
      if (remaining) {
        segments.push({ text: remaining, style: { ...currentStyle } });
      }
    }

    return segments.length > 0 ? segments : [{ text, style: {} }];
  }

  private static applyAnsiCodes(codes: number[], currentStyle: AnsiSegment['style']): AnsiSegment['style'] {
    const newStyle = { ...currentStyle };

    for (const code of codes) {
      if (code === 0) {
        // Reset
        return {};
      } else if (code === 1) {
        newStyle.bold = true;
      } else if (code === 2) {
        newStyle.dim = true;
      } else if (code === 3) {
        newStyle.italic = true;
      } else if (code === 4) {
        newStyle.underline = true;
      } else if (code === 22) {
        newStyle.bold = false;
        newStyle.dim = false;
      } else if (code === 23) {
        newStyle.italic = false;
      } else if (code === 24) {
        newStyle.underline = false;
      } else if (code >= 30 && code <= 37 || code >= 90 && code <= 97) {
        newStyle.color = this.ANSI_COLORS[code];
      } else if (code >= 40 && code <= 47) {
        newStyle.backgroundColor = this.ANSI_COLORS[code];
      } else if (code === 39) {
        delete newStyle.color;
      } else if (code === 49) {
        delete newStyle.backgroundColor;
      }
    }

    return newStyle;
  }
}

// ======================== TERMINAL COMPONENT ========================

interface TerminalLine {
  id: string;
  segments: AnsiSegment[];
  type: 'system' | 'input' | 'output';
}

function TerminalModal({
  server,
  session,
  onClose,
}: {
  server: Server | null;
  session: { sessionId: string; wsUrl: string } | null;
  onClose: () => void;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<ScrollView>(null);
  const inputRef = useRef<TextInput>(null);

  const [input, setInput] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: '0',
      segments: [{ text: "Connecting to server...", style: { color: '#9ca3af' } }],
      type: 'system'
    },
  ]);

  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const lineIdCounter = useRef(1);

  /* -------------------- WS CONNECT -------------------- */
  useEffect(() => {
    if (!server || !session || wsRef.current) return;

    const ws = new WebSocket(`${WS_URL}${session.wsUrl}`);
    wsRef.current = ws;

    ws.onopen = () => {
      addLine([{ text: "Connected to terminal session", style: { color: '#98c379' } }], 'system');
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "terminal:output") {
          const segments = AnsiParser.parse(msg.data);
          // Filter out empty segments
          const filteredSegments = segments.filter(s => s.text.trim().length > 0);
          if (filteredSegments.length > 0) {
            addLine(filteredSegments, 'output');
          }
        }
      } catch (error) {
        console.error('Terminal WS error:', error);
      }
    };

    ws.onerror = (error) => {
      addLine([{ text: "Connection error", style: { color: '#e06c75' } }], 'system');
    };

    ws.onclose = () => {
      addLine([{ text: "Disconnected from terminal", style: { color: '#e5c07b' } }], 'system');
      wsRef.current = null;
    };

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [session?.sessionId]);

  /* -------------------- ADD LINE -------------------- */
  const addLine = (segments: AnsiSegment[], type: TerminalLine['type']) => {
    setLines(prev => [
      ...prev,
      {
        id: String(lineIdCounter.current++),
        segments,
        type,
      }
    ]);
  };

  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [lines]);

  /* -------------------- COMMAND SEND -------------------- */
  const runCommand = () => {
    if (!input.trim() || !wsRef.current) return;

    // Save to history
    historyRef.current.unshift(input);
    historyIndexRef.current = -1;

    // Show input line with prompt
    addLine([
      { text: '$ ', style: { color: '#22d3ee', bold: true } },
      { text: input, style: { color: '#e5e7eb' } }
    ], 'input');

    // Send to server
    wsRef.current.send(
      JSON.stringify({
        type: "terminal:input",
        data: input + "\n",
      })
    );

    setInput("");
  };

  /* -------------------- CLEAR TERMINAL -------------------- */
  const clearTerminal = () => {
    setLines([
      {
        id: String(lineIdCounter.current++),
        segments: [{ text: "Terminal cleared", style: { color: '#9ca3af' } }],
        type: 'system'
      }
    ]);
  };

  if (!server || !session) return null;

  return (
    <Modal visible animationType="slide">
      <SafeAreaView style={styles.terminalContainer}>
        {/* Header */}
        <View style={styles.terminalHeader}>
          <View>
            <Text style={styles.headerTitle}>
              {server.hostname}
            </Text>
            <Text style={styles.headerSubtitle}>
              Connected • {server.os}
            </Text>
          </View>

          <View style={styles.headerActions}>
            <Pressable onPress={clearTerminal} style={styles.headerBtn}>
              <Text style={styles.headerBtnText}>Clear</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                wsRef.current?.close();
                onClose();
              }}
              style={styles.closeBtn}
            >
              <X size={20} color="#e5e7eb" />
            </Pressable>
          </View>
        </View>

        {/* Terminal Output */}
        <ScrollView
          ref={scrollRef}
          style={styles.terminalBody}
          contentContainerStyle={styles.terminalContent}
          keyboardShouldPersistTaps="handled"
        >
          {lines.map((line) => (
            <View key={line.id} style={styles.terminalLine}>
              {line.segments.map((segment, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.terminalText,
                    {
                      color: segment.style.color || '#e5e7eb',
                      backgroundColor: segment.style.backgroundColor,
                      fontWeight: segment.style.bold ? '700' : '400',
                      opacity: segment.style.dim ? 0.6 : 1,
                      fontStyle: segment.style.italic ? 'italic' : 'normal',
                      textDecorationLine: segment.style.underline ? 'underline' : 'none',
                    }
                  ]}
                >
                  {segment.text}
                </Text>
              ))}
            </View>
          ))}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputRow}>
            <Text style={styles.prompt}>$</Text>
            <TextInput
              ref={inputRef}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={runCommand}
              returnKeyType="send"
              placeholder="Enter command"
              placeholderTextColor="#6b7280"
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              spellCheck={false}
            />
            {input.length > 0 && (
              <Pressable onPress={runCommand} style={styles.sendBtn}>
                <Text style={styles.sendBtnText}>Send</Text>
              </Pressable>
            )}
          </View>
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
	connectBtn: {
		flexDirection: "row",
		gap: 6,
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 10,
		alignItems: "center",
	},

	/* Terminal styles */
	terminalContainer: {
		flex: 1,
		backgroundColor: '#0a0e1a',
	},
	terminalHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingHorizontal: 16,
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderColor: '#1e293b',
		backgroundColor: '#0f172a',
	},
	headerTitle: {
		color: '#e5e7eb',
		fontWeight: '700',
		fontSize: 16,
	},
	headerSubtitle: {
		color: '#9ca3af',
		fontSize: 12,
		marginTop: 2,
	},
	headerActions: {
		flexDirection: 'row',
		gap: 12,
		alignItems: 'center',
	},
	headerBtn: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 6,
		backgroundColor: '#1e293b',
	},
	headerBtnText: {
		color: '#e5e7eb',
		fontSize: 13,
		fontWeight: '600',
	},
	closeBtn: {
		padding: 4,
	},
	terminalBody: {
		flex: 1,
		backgroundColor: '#0a0e1a',
	},
	terminalContent: {
		padding: 16,
		paddingBottom: 20,
	},
	terminalLine: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginBottom: 2,
	},
	terminalText: {
		fontFamily: 'monospace',
		fontSize: 13,
		lineHeight: 20,
	},
	inputContainer: {
		borderTopWidth: 1,
		borderColor: '#1e293b',
		backgroundColor: '#0f172a',
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	inputRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
	prompt: {
		color: '#22d3ee',
		fontFamily: 'monospace',
		fontSize: 16,
		fontWeight: '700',
	},
	input: {
		flex: 1,
		color: '#e5e7eb',
		fontFamily: 'monospace',
		fontSize: 14,
		padding: 0,
	},
	sendBtn: {
		backgroundColor: '#22d3ee',
		paddingHorizontal: 14,
		paddingVertical: 8,
		borderRadius: 8,
	},
	sendBtnText: {
		color: '#0a0e1a',
		fontWeight: '700',
		fontSize: 13,
	},
});