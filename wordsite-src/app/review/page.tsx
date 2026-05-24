'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { getAllWords, searchWord } from '@/data/vocabulary'
import { loadRecords } from '@/lib/storage'
import { WordCardLink } from '@/components/WordCard'
import type { StudyRecord } from '@/lib/storage'

export default function ReviewPage() {
  const [tab, setTab] = useState<'due' | 'wrong' | 'all'>('due')
  const [records, setRecords] = useState<Record<string, StudyRecord>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setRecords(loadRecords())
    const handler = () => setRecords(loadRecords())
    window.addEventListener('storage', handler)
    window.addEventListener('focus', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('focus', handler)
    }
  }, [])

  const reviewWords = useMemo(() => {
    const now = new Date()
    const allWords = getAllWords()

    if (tab === 'due') {
      return allWords.filter((w) => {
        const r = records[w.word]
        if (!r || !r.nextReview) return false
        return new Date(r.nextReview) <= now
      })
    }

    if (tab === 'wrong') {
      return allWords.filter((w) => {
        const r = records[w.word]
        return r && r.wrongCount >= 3
      })
    }

    return allWords.filter((w) => {
      const r = records[w.word]
      return r && r.correctCount > 0
    })
  }, [records, tab])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">复习计划</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        间隔重复复习，巩固记忆效果
      </p>

      <div className="flex items-center gap-2 mb-6">
        {([
          { key: 'due', label: '待复习' },
          { key: 'wrong', label: '易错词' },
          { key: 'all', label: '已学习' },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!mounted ? (
        <div className="text-center py-12 text-gray-400">加载中...</div>
      ) : reviewWords.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-2">
            {tab === 'due' ? '没有待复习的单词' : tab === 'wrong' ? '没有易错词' : '还没有学习记录'}
          </p>
          <p className="text-sm text-gray-400">
            {tab === 'due' ? '去学习新单词吧！' : ''}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {reviewWords.map((w, i) => (
            <motion.div
              key={w.word}
              initial={{ opacity: 0, transform: 'translateY(10px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ delay: i * 0.02 }}
            >
              <WordCardLink
                word={w.word}
                phonetic={w.phonetic}
                meaning={w.meaning}
                root={w.root}
                prefix={w.prefix}
                suffix={w.suffix}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
