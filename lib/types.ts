export enum FYType {
  qing = 0,  // 清音
  zhuo = 1,  // 浊音
  niu = 2,   // 拗音
}

export interface MemoObject {
  id: string
  displayText: string      // 平假名
  displayText2: string     // 片假名
  remind: string           // 罗马音
  fyType: FYType
  selected: boolean
  labels: string[]
}

export type DisplayMode = "A" | "Ping" | "Pian" | "luo" | "swap"

