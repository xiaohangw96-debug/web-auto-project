import vocabularyRaw from './vocabulary.json'
import { WordData } from './types'

const vocabularyData: WordData[] = vocabularyRaw as WordData[]

export function searchWord(word: string): WordData | undefined {
  if (!word.trim()) return undefined
  return vocabularyData.find(
    (w) => w.word.toLowerCase() === word.toLowerCase()
  )
}

export function searchWords(
  query: string
): { word: WordData; matchType: 'word' | 'meaning' | 'root' | 'affix' }[] {
  if (!query.trim()) return []
  const q = query.toLowerCase().trim()
  const results: { word: WordData; matchType: 'word' | 'meaning' | 'root' | 'affix' }[] = []

  for (const w of vocabularyData) {
    if (w.word.toLowerCase().includes(q)) {
      results.push({ word: w, matchType: 'word' })
      continue
    }
    if (w.meaning.includes(q)) {
      results.push({ word: w, matchType: 'meaning' })
      continue
    }
    if (w.root && w.root.toLowerCase().includes(q)) {
      results.push({ word: w, matchType: 'root' })
      continue
    }
    if (
      (w.prefix && w.prefix.toLowerCase().includes(q)) ||
      (w.suffix && w.suffix.toLowerCase().includes(q))
    ) {
      results.push({ word: w, matchType: 'affix' })
    }
  }

  const order = { word: 0 as const, meaning: 1 as const, root: 2 as const, affix: 3 as const }
  return results.sort((a, b) => {
    const diff = order[a.matchType] - order[b.matchType]
    if (diff !== 0) return diff
    return a.word.word.localeCompare(b.word.word)
  })
}

export function getWordsByRoot(root: string): WordData[] {
  return vocabularyData.filter((w) => w.root === root)
}

export function getWordsByAffix(affix: string): WordData[] {
  return vocabularyData.filter((w) => w.prefix === affix || w.suffix === affix)
}

export function getHighFrequencyWords(limit: number = 50): WordData[] {
  return [...vocabularyData]
    .filter((w) => w.frequency >= 3)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit)
}

export function getWordsByPrefix(prefix: string): WordData[] {
  return vocabularyData.filter(
    (w) => w.word.toLowerCase().startsWith(prefix.toLowerCase())
  )
}

export function getAllWords(): WordData[] {
  return vocabularyData
}

export function getTotalWordCount(): number {
  return vocabularyData.length
}

export { vocabularyData }
