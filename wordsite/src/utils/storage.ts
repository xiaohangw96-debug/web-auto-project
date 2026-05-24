import { StudyRecord, Stats, StudyStatus } from "@/types";

const STORAGE_KEYS = {
  STUDY_RECORDS: "wordsite_study_records",
  STATS: "wordsite_stats",
  FAVORITES: "wordsite_favorites",
  THEME: "wordsite_theme",
  DAILY_CHECKIN: "wordsite_daily_checkin",
} as const;

export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full or unavailable
  }
}

// Study Records
export function getStudyRecords(): Record<string, StudyRecord> {
  return getItem<Record<string, StudyRecord>>(STORAGE_KEYS.STUDY_RECORDS, {});
}

export function setStudyRecords(records: Record<string, StudyRecord>): void {
  setItem(STORAGE_KEYS.STUDY_RECORDS, records);
}

export function getStudyRecord(word: string): StudyRecord | null {
  const records = getStudyRecords();
  return records[word] || null;
}

export function updateStudyRecord(word: string, updates: Partial<StudyRecord>): void {
  const records = getStudyRecords();
  const existing = records[word] || {
    word,
    stage: 0,
    nextReview: Date.now(),
    lastReview: 0,
    correctCount: 0,
    wrongCount: 0,
    learned: false,
    favorite: false,
  };
  records[word] = { ...existing, ...updates, lastReview: Date.now() };
  setStudyRecords(records);
}

// Favorites
export function getFavorites(): string[] {
  return getItem<string[]>(STORAGE_KEYS.FAVORITES, []);
}

export function toggleFavorite(word: string): boolean {
  const favs = getFavorites();
  const idx = favs.indexOf(word);
  if (idx === -1) {
    favs.push(word);
    setItem(STORAGE_KEYS.FAVORITES, favs);
    return true;
  } else {
    favs.splice(idx, 1);
    setItem(STORAGE_KEYS.FAVORITES, favs);
    return false;
  }
}

export function isFavorite(word: string): boolean {
  return getFavorites().includes(word);
}

// Stats
const DEFAULT_STATS: Stats = {
  totalWords: 0,
  mastered: 0,
  todayLearned: 0,
  streak: 0,
  lastStudyDate: "",
};

export function getStats(): Stats {
  const stored = getItem<Stats>(STORAGE_KEYS.STATS, DEFAULT_STATS);
  const today = new Date().toDateString();
  if (stored.lastStudyDate !== today) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const newStreak = stored.lastStudyDate === yesterday ? stored.streak : 0;
    return { ...stored, todayLearned: 0, lastStudyDate: today, streak: newStreak };
  }
  return stored;
}

export function updateStats(updates: Partial<Stats>): void {
  const stats = getStats();
  setItem(STORAGE_KEYS.STATS, { ...stats, ...updates });
}

export function markWordLearned(): void {
  const stats = getStats();
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  let streak = stats.streak;
  if (stats.lastStudyDate !== today) {
    if (stats.lastStudyDate === yesterday) {
      streak += 1;
    } else if (stats.lastStudyDate !== today) {
      streak = 1;
    }
  }

  setItem(STORAGE_KEYS.STATS, {
    ...stats,
    mastered: stats.mastered + 1,
    todayLearned: stats.todayLearned + 1,
    streak,
    lastStudyDate: today,
  });
}

export function getStudyStatus(word: string): StudyStatus {
  const record = getStudyRecord(word);
  if (!record) return "unlearned";
  if (record.learned) return "mastered";
  return "learning";
}

// Daily Check-in
export function getDailyCheckins(): string[] {
  return getItem<string[]>(STORAGE_KEYS.DAILY_CHECKIN, []);
}

export function checkInToday(): boolean {
  const today = new Date().toDateString();
  const checkins = getDailyCheckins();
  if (checkins.includes(today)) return false;
  checkins.push(today);
  setItem(STORAGE_KEYS.DAILY_CHECKIN, checkins);
  return true;
}

export function isCheckedInToday(): boolean {
  return getDailyCheckins().includes(new Date().toDateString());
}
