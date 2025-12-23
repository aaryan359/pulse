import { Container } from "./container.type"

export interface Server {
  id: number
  uuid: string
  name: string
  hostname: string

  environment: "production" | "staging" | "development"
  os?: string
  arch?: string
  agentVersion?: string
  status?: "online" | "offline";

  userId: number
  apiKeyId: number

  lastSeenAt?: Date

  snapshot?: ServerSnapshot
  metrics: ServerMetric[]
  containers: Container[]
  events: Event[]

  createdAt: Date
  updatedAt: Date
}




export interface ServerSnapshot {
  id: number
  serverId: number

  uptimeSeconds: number

  cpuCores: number
  cpuPercent: number

  memoryTotalMB: number
  memoryUsedMB: number
  memoryPercent: number

  diskTotalGB: number
  diskUsedGB: number
  diskPercent: number

  containerCount: number
  updatedAt: Date
}



export interface ServerMetric {
  id: number
  serverId: number

  interval: "1m" | "5m" | "1h"

  cpuAvg: number
  memoryAvg: number
  diskAvg: number

  fromTime: Date
  toTime: Date

  createdAt: Date
}
