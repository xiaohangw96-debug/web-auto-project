"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { affixes } from "@/data/affixes";
import { AffixCard } from "@/components/AffixCard";

export default function AffixesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "prefix" | "suffix">("all");

  const filtered = affixes.filter((a) => {
    const matchSearch =
      a.affix.toLowerCase().includes(search.toLowerCase()) ||
      a.meaning.includes(search) ||
      a.description.includes(search);
    const matchType = filter === "all" || a.type === filter;
    return matchSearch && matchType;
  });

  const prefixCount = affixes.filter((a) => a.type === "prefix").length;
  const suffixCount = affixes.filter((a) => a.type === "suffix").length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          词缀学习
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          前缀和后缀是扩展词汇的捷径。共收录 {prefixCount} 个前缀、{suffixCount} 个后缀。
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索词缀或含义..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <div className="flex gap-1 bg-gray-50 dark:bg-gray-900 rounded-xl p-1 border border-gray-200 dark:border-gray-700">
            {(["all", "prefix", "suffix"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                  filter === t
                    ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm font-medium"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {t === "all" ? "全部" : t === "prefix" ? "前缀" : "后缀"}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((affix) => (
            <AffixCard key={affix.affix} affix={affix} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">未找到匹配的词缀</p>
        )}
      </motion.div>
    </div>
  );
}
