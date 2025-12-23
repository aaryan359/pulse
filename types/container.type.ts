export interface Container {
  id: string
  serverId: string

  containerId: string
  name: string
  image: string
  createdAt: Date

  state?: string
  status?: string

  cpuPercent?: number
  
  memoryUsageMB?: number
  memoryLimitMB?: number
  networkRxMB?: number
  networkTxMB?: number

  lastSeenAt: Date
 
}
