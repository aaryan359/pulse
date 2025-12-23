export interface Threshold {
  id: string
  name: string
  metric: "cpu" | "memory" | "disk"
  operator: ">" | "<" | "="
  value: number
  enabled: boolean
}