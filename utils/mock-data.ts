import { ApiKey } from "@/types/apiKey.type"
import { Event } from "@/types/event.type"
import { Threshold } from "@/types/threshold.type"






export const mockEvents: Event[] = [
  {
    id: "e1",
    serverId: "2",
    serverName: "web-prod-01",
    type: "container_crashed",
    severity: "critical",
    message: "Container worker-queue crashed with OOMKilled",
    timestamp: new Date(Date.now() - 1800000),
  },
  {
    id: "e2",
    serverId: "2",
    serverName: "web-prod-01",
    type: "high_memory",
    severity: "warning",
    message: "Memory usage exceeded 85% threshold",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "e3",
    serverId: "4",
    serverName: "dev-local",
    type: "server_offline",
    severity: "critical",
    message: "Server went offline",
    timestamp: new Date(Date.now() - 3600000),
  },
  {
    id: "e4",
    serverId: "1",
    serverName: "api-prod-01",
    type: "container_restarted",
    severity: "info",
    message: "Container api-server was restarted",
    timestamp: new Date(Date.now() - 7200000),
  },
  {
    id: "e5",
    serverId: "3",
    serverName: "db-staging",
    type: "disk_full",
    severity: "warning",
    message: "Disk usage approaching 75%",
    timestamp: new Date(Date.now() - 86400000),
  },
]

export const mockApiKeys: ApiKey[] = [
  {
    id: "k1",
    name: "Production Agent",
    key: "sp_live_xxxx...xxxx1234",
    createdAt: new Date(Date.now() - 2592000000),
    lastUsed: new Date(),
    status: "active",
  },
  {
    id: "k2",
    name: "Staging Agent",
    key: "sp_test_xxxx...xxxx5678",
    createdAt: new Date(Date.now() - 604800000),
    lastUsed: new Date(Date.now() - 86400000),
    status: "active",
  },
]

export const mockThresholds: Threshold[] = [
  { id: "t1", name: "High CPU Alert", metric: "cpu", operator: ">", value: 80, enabled: true },
  { id: "t2", name: "High Memory Alert", metric: "memory", operator: ">", value: 85, enabled: true },
  { id: "t3", name: "Disk Full Alert", metric: "disk", operator: ">", value: 90, enabled: true },
]

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  if (days > 0) return `${days}d ${hours}h`
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "--"

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}
