'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getHighFrequencyWords } from '@/data/vocabulary'
import { WordCardLink } from '@/components/WordCard'



export default function HighFrequencyPage() {
  const [limit, setLimit] = useState(50)
  const words = useMemo(() => getHighFrequencyWords(limit), [limit])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">高频词汇</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            按出现频率排序的词汇，优先学习
          </p>
        </div>
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="px-3 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 outline-none"
        >
          <option value={20}>前 20</option>
          <option value={50}>前 50</option>
          <option value={100}>前 100</option>
          <option value={200}>前 200</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {words.map((word, i) => (
          <motion.div
            key={word.word}
            initial={{ opacity: 0, transform: 'translateY(10px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
            transition={{ delay: i * 0.02 }}
          >
            <WordCardLink
              word={word.word}
              phonetic={word.phonetic}
              meaning={word.meaning}
              root={word.root}
              prefix={word.prefix}
              suffix={word.suffix}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
