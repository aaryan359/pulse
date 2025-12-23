import { WS_URL } from "@/config/ws";
import { ServerSnapshot } from "@/types/server.type";
import { useEffect, useRef } from "react";

export const useServerWebSocket = (
  serverId: number,
  onSnapshot: (snapshot: ServerSnapshot) => void
) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!serverId) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WS connected");
      ws.send(
        JSON.stringify({
          type: "SUBSCRIBE_SERVER",
          serverId,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "SERVER_SNAPSHOT") {
          onSnapshot(message.data);
        }
      } catch (e) {
        console.warn("Invalid WS message", e);
      }
    };

    ws.onerror = () => {
      console.warn("WebSocket error");
    };

    ws.onclose = () => {
      console.log("🔌 WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, [serverId]);
};
