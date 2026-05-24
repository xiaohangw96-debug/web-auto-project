export type WordStatus = 'not_learned' | 'learning' | 'mastered'

export interface StudyRecord {
  word: string
  status: WordStatus
  favorite: boolean
  correctCount: number
  wrongCount: number
  lastReview: string
  nextReview: string
}

export interface StudyStats {
  totalWords: number
  mastered: number
  learning: number
  notLearned: number
  favorites: number
}

const RECORDS_KEY = 'wordsite_study_records'
const STATS_KEY = 'wordsite_stats'

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function loadRecords(): Record<string, StudyRecord> {
  return loadJSON<Record<string, StudyRecord>>(RECORDS_KEY, {})
}

export function saveRecords(records: Record<string, StudyRecord>): void {
  saveJSON(RECORDS_KEY, records)
}

export function getRecord(
  word: string
): StudyRecord {
  const records = loadRecords()
  return (
    records[word] || {
      word,
      status: 'not_learned' as const,
      favorite: false,
      correctCount: 0,
      wrongCount: 0,
      lastReview: '',
      nextReview: '',
    }
  )
}

export function setRecord(record: StudyRecord): void {
  const records = loadRecords()
  records[record.word] = record
  saveRecords(records)
}

export function toggleFavorite(word: string): boolean {
  const record = getRecord(word)
  record.favorite = !record.favorite
  setRecord(record)
  return record.favorite
}

export function isFavorite(word: string): boolean {
  return getRecord(word).favorite
}

export function setWordStatus(word: string, status: WordStatus): void {
  const record = getRecord(word)
  record.status = status
  setRecord(record)
}

export function getWordStatus(word: string): WordStatus {
  return getRecord(word).status
}

export function markCorrect(word: string): void {
  const record = getRecord(word)
  record.correctCount++
  record.lastReview = new Date().toISOString()
  const intervals = [1, 2, 4, 7, 15, 30]
  const stage = Math.min(record.correctCount, intervals.length - 1)
  const next = new Date()
  next.setDate(next.getDate() + intervals[stage])
  record.nextReview = next.toISOString()
  if (record.correctCount >= 3) {
    record.status = 'mastered'
  } else if (record.correctCount >= 1) {
    record.status = 'learning'
  }
  setRecord(record)
}

export function markWrong(word: string): void {
  const record = getRecord(word)
  record.wrongCount++
  record.lastReview = new Date().toISOString()
  const next = new Date()
  next.setDate(next.getDate() + 1)
  record.nextReview = next.toISOString()
  if (record.status === 'not_learned') {
    record.status = 'learning'
  }
  setRecord(record)
}

export function computeStats(totalWords: number): StudyStats {
  const records = loadRecords()
  const all = Object.values(records)

  const mastered = all.filter((r) => r.status === 'mastered').length
  const learning = all.filter((r) => r.status === 'learning').length
  const favorites = all.filter((r) => r.favorite).length
  const notLearned = totalWords - mastered - learning

  return {
    totalWords,
    mastered,
    learning,
    notLearned: Math.max(0, notLearned),
    favorites,
  }
}

export function getFavoriteWords(): string[] {
  const records = loadRecords()
  return Object.values(records)
    .filter((r) => r.favorite)
    .map((r) => r.word)
}
