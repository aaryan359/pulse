// types/event.type.ts
export type EventSeverity = "critical" | "warning" | "info"

export type EventType =
  | "container_crashed"
  | "container_restarted"
  | "server_offline"
  | "high_cpu"
  | "high_memory"
  | "disk_full"

export interface Event {
  id: number
  serverId: number
  serverName: string
  type: EventType
  severity: EventSeverity
  message: string
  createdAt: string 
}
