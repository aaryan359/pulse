export interface Container {
  id: number
  containerId: string
  name: string
  image: string
  createdAt: string

  state: "running" | "exited" | "created" | "dead" | string
  status: string

  cpuPercent?: number
  memoryUsageMB?: number
  memoryLimitMB?: number
  networkRxMB?: number
  networkTxMB?: number

  lastSeenAt: string
}

