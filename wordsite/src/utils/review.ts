import { StudyRecord } from "@/types";

const REVIEW_INTERVALS = [1, 2, 4, 7, 15, 30];

export function getNextReviewTime(stage: number): number {
  if (stage >= REVIEW_INTERVALS.length) return 0;
  const days = REVIEW_INTERVALS[stage];
  return Date.now() + days * 86400000;
}

export function getWordsForReview(records: Record<string, StudyRecord>): StudyRecord[] {
  const now = Date.now();
  return Object.values(records).filter(
    (r) => !r.learned && r.nextReview <= now && r.stage > 0
  );
}

export function advanceStage(record: StudyRecord, correct: boolean): StudyRecord {
  const newStage = correct
    ? Math.min(record.stage + 1, REVIEW_INTERVALS.length)
    : Math.max(1, record.stage - 1);

  return {
    ...record,
    stage: newStage,
    nextReview: correct ? getNextReviewTime(newStage) : getNextReviewTime(Math.max(1, newStage)),
    lastReview: Date.now(),
    correctCount: correct ? record.correctCount + 1 : record.correctCount,
    wrongCount: correct ? record.wrongCount : record.wrongCount + 1,
    learned: newStage >= REVIEW_INTERVALS.length,
  };
}

export function getReviewStageName(stage: number): string {
  if (stage === 0) return "未学习";
  const names = ["第1次复习", "第2次复习", "第3次复习", "第4次复习", "第5次复习", "已掌握"];
  return names[Math.min(stage, names.length - 1)];
}

export function getWrongWords(records: Record<string, StudyRecord>): StudyRecord[] {
  return Object.values(records).filter((r) => r.wrongCount >= 3);
}
