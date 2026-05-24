"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Word } from "@/types";
import { getHighFrequencyWords, getWordsByLetter } from "@/utils/search";
import { WordCard } from "@/components/WordCard";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function HighFrequencyPage() {
  const [mode, setMode] = useState<"frequency" | "alphabet">("frequency");
  const [selectedLetter, setSelectedLetter] = useState("");
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    if (mode === "frequency") {
      setWords(getHighFrequencyWords());
    }
  }, [mode]);

  useEffect(() => {
    if (mode === "alphabet" && selectedLetter) {
      setWords(getWordsByLetter(selectedLetter));
    }
  }, [mode, selectedLetter]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          高频词汇
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          专升本考试高频核心词汇，共 {getHighFrequencyWords().length} 个
        </p>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-900 rounded-xl p-1 border border-gray-200 dark:border-gray-700 w-fit mb-6">
          <button
            onClick={() => setMode("frequency")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
              mode === "frequency"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm font-medium"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            按词频
          </button>
          <button
            onClick={() => setMode("alphabet")}
            className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
              mode === "alphabet"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm font-medium"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            按字母
          </button>
        </div>

        {mode === "alphabet" && (
          <div className="flex flex-wrap gap-1 mb-6">
            {LETTERS.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                  selectedLetter === letter
                    ? "bg-primary-600 text-white"
                    : "bg-gray-50 dark:bg-gray-900 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700"
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {words.map((word) => (
            <WordCard key={word.word} word={word} />
          ))}
        </div>

        {words.length === 0 && mode === "alphabet" && !selectedLetter && (
          <p className="text-center text-gray-400 py-12">请选择一个字母</p>
        )}
      </motion.div>
    </div>
  );
}
