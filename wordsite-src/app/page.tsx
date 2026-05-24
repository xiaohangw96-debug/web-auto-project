'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getAllRoots } from '@/data/roots'
import { getAllAffixes } from '@/data/affixes'
import { getTotalWordCount } from '@/data/vocabulary'
import { computeStats } from '@/lib/storage'



export default function HomePage() {
  const [stats, setStats] = useState({
    totalWords: 527,
    mastered: 0,
    learning: 0,
    notLearned: 527,
    favorites: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setStats(computeStats(getTotalWordCount()))
    const handler = () => setStats(computeStats(getTotalWordCount()))
    window.addEventListener('storage', handler)
    window.addEventListener('focus', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('focus', handler)
    }
  }, [])

  const rootCount = getAllRoots().length
  const affixCount = getAllAffixes().length
  const completionRate = stats.totalWords > 0 ? Math.round((stats.mastered / stats.totalWords) * 100) : 0

  const statCards = [
    { label: '总词数', value: stats.totalWords, color: 'text-gray-900 dark:text-white' },
    { label: '已掌握', value: stats.mastered, color: 'text-green-600' },
    { label: '学习中', value: stats.learning, color: 'text-blue-600' },
    { label: '未学习', value: stats.notLearned, color: 'text-gray-400' },
    { label: '收藏', value: stats.favorites, color: 'text-red-500' },
    { label: '完成率', value: `${completionRate}%`, color: 'text-primary-600' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
          <span className="text-primary-600">词根</span>背单词
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          用词根词缀理解单词，让记忆更高效
        </p>
      </div>

      {/* Stats */}
      {mounted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-12"
        >
          {statCards.map((s) => (
            <div
              key={s.label}
              className="text-center p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
            >
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { href: '/roots', label: '词根列表', desc: `${rootCount} 个词根` },
          { href: '/affixes', label: '词缀列表', desc: `${affixCount} 个词缀` },
          { href: '/high-frequency', label: '高频词汇', desc: '按频率排序' },
          { href: '/quiz', label: '词汇测试', desc: '检验学习成果' },
          { href: '/review', label: '复习计划', desc: '间隔重复复习' },
          { href: '/favorites', label: '我的收藏', desc: `${stats.favorites} 个收藏` },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors group"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {item.label}
            </h3>
            <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
