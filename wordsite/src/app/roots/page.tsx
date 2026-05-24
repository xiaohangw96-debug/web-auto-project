"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { roots } from "@/data/roots";
import { RootCard } from "@/components/RootCard";
import { words } from "@/data/words";

export default function RootsPage() {
  const [search, setSearch] = useState("");

  const filtered = roots.filter(
    (r) =>
      r.root.toLowerCase().includes(search.toLowerCase()) ||
      r.meaning.includes(search) ||
      r.description.includes(search)
  );

  const wordCounts = new Map<string, number>();
  words.forEach((w) => {
    if (w.root) wordCounts.set(w.root, (wordCounts.get(w.root) || 0) + 1);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          词根学习
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          理解词根，就能举一反三记住一组单词。共收录 {roots.length} 个词根。
        </p>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索词根或含义..."
          className="w-full max-w-md mb-8 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((root) => (
            <RootCard key={root.root} root={root} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">未找到匹配的词根</p>
        )}
      </motion.div>
    </div>
  );
}
