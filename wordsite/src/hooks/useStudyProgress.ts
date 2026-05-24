"use client";

import { useState, useCallback } from "react";
import { StudyRecord } from "@/types";
import {
  getStudyRecords,
  setStudyRecords,
  updateStudyRecord,
  getStats,
  markWordLearned,
} from "@/utils/storage";
import { advanceStage } from "@/utils/review";

export function useStudyProgress() {
  const [records, setRecords] = useState<Record<string, StudyRecord>>({});
  const [stats, setStatsState] = useState(getStats());

  const refresh = useCallback(() => {
    setRecords(getStudyRecords());
    setStatsState(getStats());
  }, []);

  const markCorrect = useCallback(
    (word: string) => {
      const records = getStudyRecords();
      const existing = records[word] || {
        word,
        stage: 0,
        nextReview: 0,
        lastReview: 0,
        correctCount: 0,
        wrongCount: 0,
        learned: false,
        favorite: false,
      };
      const updated = advanceStage(existing, true);
      if (updated.learned && !existing.learned) {
        markWordLearned();
      }
      records[word] = updated;
      setStudyRecords(records);
      refresh();
    },
    [refresh]
  );

  const markWrong = useCallback(
    (word: string) => {
      const records = getStudyRecords();
      const existing = records[word] || {
        word,
        stage: 0,
        nextReview: 0,
        lastReview: 0,
        correctCount: 0,
        wrongCount: 0,
        learned: false,
        favorite: false,
      };
      const updated = advanceStage(existing, false);
      records[word] = updated;
      setStudyRecords(records);
      refresh();
    },
    [refresh]
  );

  const toggleFavorite = useCallback(
    (word: string) => {
      const records = getStudyRecords();
      const existing = records[word];
      if (existing) {
        existing.favorite = !existing.favorite;
        records[word] = existing;
        setStudyRecords(records);
        refresh();
      } else {
        records[word] = {
          word,
          stage: 0,
          nextReview: 0,
          lastReview: 0,
          correctCount: 0,
          wrongCount: 0,
          learned: false,
          favorite: true,
        };
        setStudyRecords(records);
        refresh();
      }
    },
    [refresh]
  );

  const resetWord = useCallback(
    (word: string) => {
      const records = getStudyRecords();
      records[word] = {
        word,
        stage: 0,
        nextReview: Date.now(),
        lastReview: 0,
        correctCount: 0,
        wrongCount: 0,
        learned: false,
        favorite: false,
      };
      setStudyRecords(records);
      refresh();
    },
    [refresh]
  );

  return {
    records,
    stats,
    refresh,
    markCorrect,
    markWrong,
    toggleFavorite,
    resetWord,
  };
}
