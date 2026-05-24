"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { searchWords, SearchResult } from "@/utils/search";
import { words } from "@/data/words";

export function SearchBarInline({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      setResults(searchWords(query).slice(0, 8));
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="max-w-xl mx-auto">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Enter" && results[0]) {
            router.push(`/word/${results[0].word.word}`);
            onClose();
          }
        }}
        placeholder="搜索单词、词根、中文含义..."
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      />
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden shadow-lg"
          >
            {results.map((r) => (
              <button
                key={r.word.word}
                onClick={() => {
                  router.push(`/word/${r.word.word}`);
                  onClose();
                }}
                className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between"
              >
                <div>
                  <span className="font-medium text-sm">{r.word.word}</span>
                  <span className="text-xs text-gray-400 ml-2">{r.word.phonetic}</span>
                </div>
                <span className="text-xs text-gray-500">{r.word.meaning}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
