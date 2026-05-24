"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { roots } from "@/data/roots";
import { getWordsByRoot } from "@/utils/search";
import { WordCard } from "@/components/WordCard";

export function RootDetailClient({ rootText }: { rootText: string }) {
  const root = roots.find((r) => r.root === rootText);
  const rootWords = getWordsByRoot(rootText);

  if (!root) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          词根未找到
        </h2>
        <Link href="/roots" className="text-primary-600 hover:underline">
          返回词根列表
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          href="/roots"
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ← 返回词根列表
        </Link>

        <div className="mt-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl font-mono font-bold text-purple-600 dark:text-purple-400">
              {root.root}
            </span>
            <span className="text-sm text-gray-400">{root.origin}</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {root.meaning}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {root.description}
          </p>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <span className="font-medium">记忆技巧：</span>
              {root.memoryTip}
            </p>
          </div>
        </div>

        <section className="mb-8 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            词根关系图
          </h2>
          <div className="flex flex-col items-center">
            <div className="px-4 py-2 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-mono font-bold text-lg mb-4">
              {root.root} = {root.meaning}
            </div>
            <div className="w-px h-4 bg-purple-200 dark:bg-purple-800" />
            <div className="flex flex-wrap justify-center gap-2 max-w-lg">
              {root.words.map((w) => (
                <Link
                  key={w}
                  href={`/word/${w}`}
                  className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 text-sm hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors"
                >
                  {w}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            包含词根 &ldquo;{root.root}&rdquo; 的单词 ({rootWords.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {rootWords.map((word) => (
              <WordCard key={word.word} word={word} />
            ))}
          </div>
          {rootWords.length === 0 && (
            <p className="text-gray-400 text-sm">暂无相关单词数据</p>
          )}
        </section>
      </motion.div>
    </div>
  );
}
