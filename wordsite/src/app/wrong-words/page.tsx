"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { StudyRecord } from "@/types";
import { getStudyRecords, setStudyRecords } from "@/utils/storage";
import { getWrongWords } from "@/utils/review";
import { words as allWords } from "@/data/words";
import { WordCard } from "@/components/WordCard";

export default function WrongWordsPage() {
  const [wrongWords, setWrongWords] = useState<StudyRecord[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const records = getStudyRecords();
    setWrongWords(getWrongWords(records));
  }, [refreshKey]);

  const removeWrongWord = (word: string) => {
    const records = getStudyRecords();
    if (records[word]) {
      records[word].wrongCount = 0;
      setStudyRecords(records);
      setRefreshKey((k) => k + 1);
    }
  };

  const resetAll = () => {
    const records = getStudyRecords();
    for (const r of Object.values(records)) {
      r.wrongCount = 0;
    }
    setStudyRecords(records);
    setRefreshKey((k) => k + 1);
  };

  const wordData = wrongWords.map((r) => ({
    ...r,
    wordData: allWords.find((w) => w.word === r.word),
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            错词本
          </h1>
          {wrongWords.length > 0 && (
            <button
              onClick={resetAll}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              清空全部
            </button>
          )}
        </div>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          答错3次以上的单词将自动收录于此
        </p>

        {wordData.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📗</div>
            <p className="text-gray-400 mb-4">暂无错词，继续保持！</p>
            <Link
              href="/quiz"
              className="text-primary-600 hover:underline text-sm"
            >
              去做测试 →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {wordData.map((r) => (
              <div key={r.word} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/word/${r.word}`}
                        className="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-600"
                      >
                        {r.word}
                      </Link>
                      <span className="text-xs text-red-500">
                        错误 {r.wrongCount} 次
                      </span>
                    </div>
                    {r.wordData && (
                      <>
                        <p className="text-xs text-gray-400 mb-1">{r.wordData.phonetic}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {r.wordData.meaning}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/word/${r.word}`}
                      className="px-3 py-1.5 text-xs rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 hover:bg-primary-100 transition-colors"
                    >
                      重新学习
                    </Link>
                    <button
                      onClick={() => removeWrongWord(r.word)}
                      className="px-3 py-1.5 text-xs rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      移除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
