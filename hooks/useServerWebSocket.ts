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

    // CORRECT WS ENDPOINT
    const ws = new WebSocket(`${WS_URL}/ws/realtime`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Realtime WS connected");
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

    ws.onerror = (e) => {
      console.warn("WebSocket error", e);
    };

    ws.onclose = () => {
      console.log(" Realtime WS closed");
    };

    return () => {
      ws.close();
    };
  }, [serverId]);
};
