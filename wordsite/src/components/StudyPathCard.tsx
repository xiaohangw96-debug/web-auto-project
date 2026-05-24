"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface StudyPathCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  color: "blue" | "purple" | "green" | "orange" | "red";
}

const colorClasses = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-600 dark:text-blue-400",
    border: "hover:border-blue-200 dark:hover:border-blue-800",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20",
    text: "text-purple-600 dark:text-purple-400",
    border: "hover:border-purple-200 dark:hover:border-purple-800",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-600 dark:text-green-400",
    border: "hover:border-green-200 dark:hover:border-green-800",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20",
    text: "text-orange-600 dark:text-orange-400",
    border: "hover:border-orange-200 dark:hover:border-orange-800",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-600 dark:text-red-400",
    border: "hover:border-red-200 dark:hover:border-red-800",
  },
};

export function StudyPathCard({
  title,
  description,
  icon,
  href,
  color,
}: StudyPathCardProps) {
  const c = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <Link
        href={href}
        className={`block p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 ${c.border} transition-colors group`}
      >
        <div
          className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center text-lg mb-3`}
        >
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
          {title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </Link>
    </motion.div>
  );
}
