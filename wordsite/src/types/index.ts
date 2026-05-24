export interface Word {
  word: string;
  phonetic: string;
  meaning: string;
  pos: string;
  root: string;
  prefix: string;
  suffix: string;
  etymology: string;
  memory: string;
  examples: string[];
  frequency: number;
  synonyms: string[];
  audio?: string;
}

export interface WordRoot {
  root: string;
  meaning: string;
  origin: string;
  description: string;
  memoryTip: string;
  words: string[];
}

export interface Affix {
  affix: string;
  type: "prefix" | "suffix";
  meaning: string;
  origin: string;
  description: string;
  examples: string[];
}

export interface StudyRecord {
  word: string;
  stage: number;
  nextReview: number;
  lastReview: number;
  correctCount: number;
  wrongCount: number;
  learned: boolean;
  favorite: boolean;
}

export type StudyStatus = "unlearned" | "learning" | "mastered";

export interface QuizQuestion {
  type: "meaning" | "root" | "spelling";
  question: string;
  options: string[];
  correct: string;
  word: string;
}

export interface Stats {
  totalWords: number;
  mastered: number;
  todayLearned: number;
  streak: number;
  lastStudyDate: string;
}

export interface SearchResult {
  word: Word;
  matchType: "word" | "meaning" | "root" | "affix";
}
