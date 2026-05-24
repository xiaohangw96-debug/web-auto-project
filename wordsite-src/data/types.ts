export interface WordExample {
  english: string
  chinese: string
}

export interface WordData {
  word: string
  phonetic: string
  meaning: string
  pos: string
  root: string
  prefix: string
  suffix: string
  etymology: string
  memory: string
  examples: string[] | WordExample[]
  frequency: number
  synonyms: string[]
}

export interface RootGroup {
  root: string
  meaning: string
  origin: string
  description: string
  memoryTip: string
  words: string[]
}

export interface AffixData {
  affix: string
  type: 'prefix' | 'suffix'
  meaning: string
  origin: string
  description: string
  examples: string[]
}
