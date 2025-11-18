export enum FYType {
  seion = 0,   // 清音 (Seion)
  dakuon = 1,  // 浊音 (Dakuon)
  yoon = 2,    // 拗音 (Yoon)
}

export interface MemoObject {
  id: string
  displayText: string      // 平假名 (Hiragana)
  displayText2: string     // 片假名 (Katakana)
  remind: string           // 罗马音 (Romaji)
  fyType: FYType
  selected: boolean
  labels: string[]
}

export type DisplayMode = "mixed" | "hiragana" | "katakana" | "romaji" | "swap"

