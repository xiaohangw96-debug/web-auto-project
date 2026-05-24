"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WordRoot } from "@/types";

interface RootCardProps {
  root: WordRoot;
}

export function RootCard({ root }: RootCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Link
        href={`/roots/${root.root}`}
        className="block p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-purple-200 dark:hover:border-purple-800 transition-colors group"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xl font-mono font-bold text-purple-600 dark:text-purple-400">
            {root.root}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {root.origin}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {root.meaning}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
          {root.description}
        </p>
        <div className="flex flex-wrap gap-1">
          {root.words.slice(0, 5).map((w) => (
            <span
              key={w}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              {w}
            </span>
          ))}
          {root.words.length > 5 && (
            <span className="text-xs px-2 py-0.5 text-gray-400">
              +{root.words.length - 5}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
