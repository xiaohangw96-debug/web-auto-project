'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getAllWords } from '@/data/vocabulary'
import { getFavoriteWords } from '@/lib/storage'
import { WordCardLink } from '@/components/WordCard'

export default function FavoritesPage() {
  const [favWords, setFavWords] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setFavWords(getFavoriteWords())
    const handler = () => setFavWords(getFavoriteWords())
    window.addEventListener('storage', handler)
    window.addEventListener('focus', handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('focus', handler)
    }
  }, [])

  const allWords = getAllWords()
  const words = useMemo(
    () => allWords.filter((w) => favWords.includes(w.word)),
    [allWords, favWords]
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">我的收藏</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {mounted ? `共收藏 ${favWords.length} 个单词` : '加载中...'}
      </p>

      {!mounted ? (
        <div className="text-center py-12 text-gray-400">加载中...</div>
      ) : words.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 mb-2">还没有收藏任何单词</p>
          <p className="text-sm text-gray-400">
            在单词详情页点击心形图标即可收藏
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {words.map((w, i) => (
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
