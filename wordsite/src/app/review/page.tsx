"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { StudyRecord } from "@/types";
import { getStudyRecords } from "@/utils/storage";
import { getWordsForReview } from "@/utils/review";
import { words } from "@/data/words";
import { getDailyCheckins } from "@/utils/storage";
import { ProgressBar } from "@/components/ProgressBar";

export default function ReviewPage() {
  const [reviewList, setReviewList] = useState<(StudyRecord & { wordData?: typeof words[0] })[]>([]);
  const [checkins, setCheckins] = useState<string[]>([]);

  useEffect(() => {
    const records = getStudyRecords();
    const due = getWordsForReview(records);
    const enriched = due.map((r) => ({
      ...r,
      wordData: words.find((w) => w.word === r.word),
    }));
    setReviewList(enriched);
    setCheckins(getDailyCheckins());
  }, []);

  const totalStudied = Object.keys(getStudyRecords()).length;
  const mastered = Object.values(getStudyRecords()).filter((r) => r.learned).length;

  // Generate heatmap data for last 90 days
  const heatmapData: { date: string; count: number }[] = [];
  const records = getStudyRecords();
  const now = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const key = d.toDateString();
    const count = Object.values(records).filter((r) => {
      if (!r.lastReview) return false;
      return new Date(r.lastReview).toDateString() === key;
    }).length;
    heatmapData.push({ date: key, count });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          智能复习
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          基于艾宾浩斯遗忘曲线，科学安排复习时间
        </p>

        {/* Progress Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalStudied}</div>
            <div className="text-xs text-gray-500">已学习单词</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div className="text-2xl font-bold text-green-600">{mastered}</div>
            <div className="text-xs text-gray-500">已掌握</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div className="text-2xl font-bold text-primary-600">{reviewList.length}</div>
            <div className="text-xs text-gray-500">待复习</div>
          </div>
          <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <div className="text-2xl font-bold text-orange-600">{checkins.length}</div>
            <div className="text-xs text-gray-500">打卡天数</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">学习进度</span>
            <span className="text-sm text-gray-400">{mastered}/{totalStudied || words.length}</span>
          </div>
          <ProgressBar value={mastered} max={Math.max(totalStudied, words.length)} size="lg" />
        </div>

        {/* Study Heatmap */}
        <div className="mb-8 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">学习热力图</h2>
          <div className="flex flex-wrap gap-1">
            {heatmapData.map((d, i) => {
              const level = d.count === 0 ? 0 : d.count <= 2 ? 1 : d.count <= 5 ? 2 : d.count <= 10 ? 3 : 4;
              const colors = [
                "bg-gray-50 dark:bg-gray-800",
                "bg-green-200 dark:bg-green-900",
                "bg-green-400 dark:bg-green-700",
                "bg-green-500 dark:bg-green-600",
                "bg-green-600 dark:bg-green-500",
              ];
              return (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-sm ${colors[level]}`}
                  title={`${d.date}: ${d.count} 个单词`}
                />
              );
            })}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
            <span>少</span>
            <div className="w-3 h-3 rounded-sm bg-gray-50 dark:bg-gray-800" />
            <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
            <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
            <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600" />
            <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-500" />
            <span>多</span>
          </div>
        </div>

        {/* Due Reviews */}
        <section>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            待复习 ({reviewList.length})
          </h2>
          {reviewList.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="mb-2">暂无待复习的单词</p>
              <Link href="/roots" className="text-primary-600 hover:underline text-sm">
                去学习新单词 →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {reviewList.map((r) => (
                <Link
                  key={r.word}
                  href={`/word/${r.word}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors"
                >
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {r.word}
                    </span>
                    {r.wordData && (
                      <span className="text-sm text-gray-400 ml-2">
                        {r.wordData.meaning}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      复习 {r.stage}/6
                    </span>
                    <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </div>
  );
}
