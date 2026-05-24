"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { getWordByText, getWordsByRoot } from "@/utils/search";
import { useStudyProgress } from "@/hooks/useStudyProgress";
import { getStudyStatus } from "@/utils/storage";
import { roots } from "@/data/roots";
import { WordCard } from "@/components/WordCard";

export function WordDetailClient({ wordText }: { wordText: string }) {
  const word = getWordByText(wordText);
  const { markCorrect, markWrong, toggleFavorite, records } = useStudyProgress();

  if (!word) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          单词未找到
        </h2>
        <p className="text-gray-500 mb-4">该单词暂未收录</p>
        <Link href="/" className="text-primary-600 hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  const status = getStudyStatus(word.word);
  const relatedWords = word.root ? getWordsByRoot(word.root).filter((w) => w.word !== word.word) : [];
  const rootData = word.root ? roots.find((r) => r.root === word.root) : null;
  const record = records[word.word];
  const isFav = record?.favorite || false;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ← 返回
        </Link>

        <div className="mt-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {word.word}
              </h1>
              <p className="text-sm text-gray-400 mb-1">{word.phonetic}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {word.meaning}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">
                  {word.pos}
                </span>
                {status === "mastered" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    已掌握
                  </span>
                )}
                {status === "learning" && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                    学习中
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => toggleFavorite(word.word)}
              className={`p-2 rounded-xl transition-colors ${
                isFav
                  ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                  : "text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              }`}
            >
              <svg className="w-6 h-6" fill={isFav ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={isFav ? 0 : 2}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
        </div>

        {(word.prefix || word.root || word.suffix) && (
          <section className="mb-8 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              词根词缀拆解
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-lg font-mono mb-3">
              {word.prefix && (
                <>
                  <Link
                    href={`/affixes/${word.prefix}`}
                    className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {word.prefix}
                  </Link>
                  <span className="text-gray-300 dark:text-gray-600">+</span>
                </>
              )}
              {word.root && (
                <Link
                  href={`/roots/${word.root}`}
                  className="px-3 py-1 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
                >
                  {word.root}
                </Link>
              )}
              {word.suffix && (
                <>
                  <span className="text-gray-300 dark:text-gray-600">+</span>
                  <Link
                    href={`/affixes/${word.suffix}`}
                    className="px-3 py-1 rounded-lg bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                  >
                    {word.suffix}
                  </Link>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {word.etymology}
            </p>
            {word.memory && (
              <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <span className="font-medium">记忆技巧：</span>
                  {word.memory}
                </p>
              </div>
            )}
          </section>
        )}

        <section className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            例句
          </h2>
          <div className="space-y-3">
            {word.examples.map((ex, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
              >
                <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                  {ex}
                </p>
              </div>
            ))}
          </div>
        </section>

        {rootData && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                词根家族：{word.root}
              </h2>
              <Link
                href={`/roots/${word.root}`}
                className="text-xs text-primary-600 hover:text-primary-700"
              >
                查看详情 →
              </Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              {rootData.meaning} — {rootData.memoryTip}
            </p>
            {relatedWords.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {relatedWords.slice(0, 6).map((w) => (
                  <WordCard key={w.word} word={w} />
                ))}
              </div>
            )}
          </section>
        )}

        {word.synonyms.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              近义词
            </h2>
            <div className="flex flex-wrap gap-2">
              {word.synonyms.map((syn) => (
                <Link
                  key={syn}
                  href={`/word/${syn}`}
                  className="text-sm px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors"
                >
                  {syn}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={() => markCorrect(word.word)}
            className="flex-1 py-2.5 rounded-xl bg-green-500 text-white font-medium text-sm hover:bg-green-600 transition-colors"
          >
            我认识
          </button>
          <button
            onClick={() => markWrong(word.word)}
            className="flex-1 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            不认识
          </button>
        </section>
      </motion.div>
    </div>
  );
}
