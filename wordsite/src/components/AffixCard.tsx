"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Affix } from "@/types";

interface AffixCardProps {
  affix: Affix;
}

export function AffixCard({ affix }: AffixCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Link
        href={`/affixes/${affix.affix}`}
        className="block p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400">
            {affix.affix}
          </span>
          <span className="text-xs px-1.5 py-0.5 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-500">
            {affix.type === "prefix" ? "前缀" : "后缀"}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          {affix.meaning}
        </p>
        <div className="flex flex-wrap gap-1">
          {affix.examples.slice(0, 4).map((w) => (
            <span
              key={w}
              className="text-xs px-2 py-0.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            >
              {w}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
