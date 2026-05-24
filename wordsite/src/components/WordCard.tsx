"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Word } from "@/types";
import { useStudyProgress } from "@/hooks/useStudyProgress";
import { getStudyStatus } from "@/utils/storage";

interface WordCardProps {
  word: Word;
  showStatus?: boolean;
}

export function WordCard({ word, showStatus = true }: WordCardProps) {
  const { toggleFavorite } = useStudyProgress();
  const status = showStatus ? getStudyStatus(word.word) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Link
        href={`/word/${word.word}`}
        className="block p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors group"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {word.word}
              </h3>
              {status === "mastered" && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  已掌握
                </span>
              )}
              {status === "learning" && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                  学习中
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-1">{word.phonetic}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{word.meaning}</p>
            {word.root && (
              <div className="mt-2 flex items-center gap-1.5">
                {word.prefix && (
                  <span className="text-xs px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    {word.prefix}
                  </span>
                )}
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  {word.root}
                </span>
                {word.suffix && (
                  <span className="text-xs px-1.5 py-0.5 rounded-md bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    {word.suffix}
                  </span>
                )}
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(word.word);
            }}
            className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
