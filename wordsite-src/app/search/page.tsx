'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { searchWords } from '@/data/vocabulary'
import { WordCardLink } from '@/components/WordCard'

export default function SearchPage() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (query.length < 2) return []
    return searchWords(query)
  }, [query])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">搜索单词</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="输入单词、释义或词根..."
        autoFocus
        className="w-full max-w-md mb-6 px-4 py-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary-400 transition-colors text-base"
      />

      {query.length < 2 ? (
        <p className="text-sm text-gray-400">输入至少 2 个字符开始搜索</p>
      ) : results.length === 0 ? (
        <p className="text-sm text-gray-400">未找到相关单词</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {results.map((r, i) => (
            <motion.div
              key={r.word.word}
              initial={{ opacity: 0, transform: 'translateY(10px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              transition={{ delay: i * 0.02 }}
            >
              <WordCardLink
                word={r.word.word}
                phonetic={r.word.phonetic}
                meaning={r.word.meaning}
                root={r.word.root}
                prefix={r.word.prefix}
                suffix={r.word.suffix}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
