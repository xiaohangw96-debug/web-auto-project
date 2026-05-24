"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { searchWords, SearchResult } from "@/utils/search";
import { WordCard } from "@/components/WordCard";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.trim().length >= 2) {
      setResults(searchWords(query));
    } else {
      setResults([]);
    }
  }, [query]);

  const matchLabels = {
    word: "单词匹配",
    meaning: "中文匹配",
    root: "词根匹配",
    affix: "词缀匹配",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          搜索
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          支持单词、中文、词根、词缀搜索
        </p>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入单词或中文含义..."
          className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent mb-6"
        />

        {query.trim() && (
          <p className="text-sm text-gray-400 mb-4">
            找到 {results.length} 个结果
          </p>
        )}

        {results.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {Object.entries(matchLabels).map(([type, label]) => {
              const count = results.filter((r) => r.matchType === type).length;
              if (count === 0) return null;
              return (
                <span
                  key={type}
                  className="text-xs px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-500"
                >
                  {label}: {count}
                </span>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map((r) => (
            <WordCard key={r.word.word} word={r.word} />
          ))}
        </div>

        {query.trim().length >= 2 && results.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>未找到匹配的单词</p>
          </div>
        )}

        {query.trim().length < 2 && (
          <div className="text-center py-16 text-gray-400">
            <p>输入至少2个字符开始搜索</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
