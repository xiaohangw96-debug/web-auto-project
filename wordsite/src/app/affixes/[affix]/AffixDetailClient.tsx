"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { affixes } from "@/data/affixes";
import { getWordsByAffix } from "@/utils/search";
import { WordCard } from "@/components/WordCard";

export function AffixDetailClient({ affixText }: { affixText: string }) {
  const affix = affixes.find((a) => a.affix === affixText);
  const relatedWords = getWordsByAffix(affixText);

  if (!affix) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          词缀未找到
        </h2>
        <Link href="/affixes" className="text-primary-600 hover:underline">
          返回词缀列表
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
          href="/affixes"
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ← 返回词缀列表
        </Link>

        <div className="mt-6 mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl font-mono font-bold text-blue-600 dark:text-blue-400">
              {affix.affix}
            </span>
            <span className={`text-xs px-2 py-1 rounded-md ${
              affix.type === "prefix"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                : "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            }`}>
              {affix.type === "prefix" ? "前缀" : "后缀"}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {affix.meaning}
          </h1>
          <p className="text-sm text-gray-400 mb-3">{affix.origin}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
            {affix.description}
          </p>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
              例词
            </h3>
            <div className="flex flex-wrap gap-2">
              {affix.examples.map((ex) => (
                <Link
                  key={ex}
                  href={`/word/${ex}`}
                  className="px-3 py-1 rounded-lg bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 text-sm hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  {ex}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <section>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            包含此词缀的单词 ({relatedWords.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedWords.map((word) => (
              <WordCard key={word.word} word={word} />
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
}
