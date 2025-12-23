export interface Event {
  id: string
  serverId: string
  serverName: string
  type: "container_crashed" | "container_restarted" | "server_offline" | "high_cpu" | "high_memory" | "disk_full"
  severity: "critical" | "warning" | "info"
  message: string
  createdAt: Date
  
  
}