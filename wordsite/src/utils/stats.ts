import { StudyRecord, Stats } from "@/types";
import { getStudyRecords } from "./storage";

export function computeStats(): Stats {
  const records = getStudyRecords();
  const values = Object.values(records);
  const today = new Date().toDateString();

  const mastered = values.filter((r) => r.learned).length;
  const todayLearned = values.filter((r) => {
    return r.lastReview && new Date(r.lastReview).toDateString() === today;
  }).length;

  const sortedDates = values
    .map((r) => (r.lastReview ? new Date(r.lastReview).toDateString() : ""))
    .filter(Boolean)
    .sort();

  let streak = 0;
  if (sortedDates.length > 0) {
    const uniqueDates = [...new Set(sortedDates)].sort().reverse();
    streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const d1 = new Date(uniqueDates[i]);
      const d2 = new Date(uniqueDates[i + 1]);
      if ((d1.getTime() - d2.getTime()) / 86400000 <= 1) {
        streak++;
      } else {
        break;
      }
    }
  }

  return {
    totalWords: Object.keys(records).length || 0,
    mastered,
    todayLearned,
    streak,
    lastStudyDate: today,
  };
}

export function getStudyHeatmap(): Record<string, number> {
  const records = getStudyRecords();
  const heatmap: Record<string, number> = {};

  for (const record of Object.values(records)) {
    if (record.lastReview) {
      const date = new Date(record.lastReview).toDateString();
      heatmap[date] = (heatmap[date] || 0) + 1;
    }
  }

  return heatmap;
}
