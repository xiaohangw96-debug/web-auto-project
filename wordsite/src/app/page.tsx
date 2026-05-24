"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { StatsCard } from "@/components/StatsCard";
import { StudyPathCard } from "@/components/StudyPathCard";
import { WordCard } from "@/components/WordCard";
import { computeStats } from "@/utils/stats";
import { getHighFrequencyWords } from "@/utils/search";
import { words as allWords } from "@/data/words";
import { Stats, Word } from "@/types";

const studyPaths = [
  {
    title: "高频核心词",
    description: "专升本高频词汇，按词频排列",
    icon: "🔥",
    href: "/high-frequency",
    color: "red" as const,
  },
  {
    title: "词根学习",
    description: "150+词根，按族记忆事半功倍",
    icon: "🌳",
    href: "/roots",
    color: "purple" as const,
  },
  {
    title: "词缀学习",
    description: "100+前缀后缀，快速扩展词汇",
    icon: "🧩",
    href: "/affixes",
    color: "blue" as const,
  },
  {
    title: "每日复习",
    description: "艾宾浩斯遗忘曲线智能复习",
    icon: "📅",
    href: "/review",
    color: "green" as const,
  },
  {
    title: "错词本",
    description: "答错3次以上自动收录",
    icon: "📕",
    href: "/wrong-words",
    color: "orange" as const,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalWords: 0,
    mastered: 0,
    todayLearned: 0,
    streak: 0,
    lastStudyDate: "",
  });
  const [highFreqWords, setHighFreqWords] = useState<Word[]>([]);

  useEffect(() => {
    setStats(computeStats());
    setHighFreqWords(getHighFrequencyWords(6));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 text-balance">
            专升本<span className="text-primary-600">词根</span>背单词
          </h1>
          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8">
            用词根词缀理解单词，而不是死记硬背
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/roots"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary-600 text-white font-medium text-sm hover:bg-primary-700 transition-colors shadow-sm"
            >
              开始学习
            </Link>
            <Link
              href="/high-frequency"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              高频词汇
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
        >
          <motion.div variants={item}>
            <StatsCard
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              }
              label="总词汇数"
              value={allWords.length}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatsCard
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              label="已掌握"
              value={stats.mastered}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatsCard
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
              label="今日学习"
              value={stats.todayLearned}
            />
          </motion.div>
          <motion.div variants={item}>
            <StatsCard
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              }
              label="连续天数"
              value={stats.streak}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Study Paths */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          学习路径
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {studyPaths.map((path, i) => (
            <StudyPathCard key={path.href} {...path} />
          ))}
        </div>
      </section>

      {/* Recommended Words */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            高频词汇
          </h2>
          <Link
            href="/high-frequency"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {highFreqWords.map((word) => (
            <WordCard key={word.word} word={word} />
          ))}
        </div>
      </section>

      {/* Quick Test CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 p-8 md:p-12 text-center text-white"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3">测试一下你的词汇量</h2>
          <p className="text-primary-100 mb-6 max-w-md mx-auto">
            10道选择题，看看你对词根词缀的掌握程度
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-primary-600 font-medium text-sm hover:bg-gray-50 transition-colors"
          >
            开始测试
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
