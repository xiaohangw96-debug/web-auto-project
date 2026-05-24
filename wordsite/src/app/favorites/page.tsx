"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Word } from "@/types";
import { words as allWords } from "@/data/words";
import { getStudyRecords } from "@/utils/storage";
import { WordCard } from "@/components/WordCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Word[]>([]);

  useEffect(() => {
    const records = getStudyRecords();
    const favWords = Object.values(records)
      .filter((r) => r.favorite)
      .map((r) => allWords.find((w) => w.word === r.word))
      .filter(Boolean) as Word[];
    setFavorites(favWords);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          我的收藏
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          收藏的单词 ({favorites.length})
        </p>

        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">❤️</div>
            <p className="text-gray-400 mb-4">还没有收藏任何单词</p>
            <Link href="/" className="text-primary-600 hover:underline text-sm">
              去浏览单词 →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {favorites.map((word) => (
              <WordCard key={word.word} word={word} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
