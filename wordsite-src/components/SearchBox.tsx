'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { searchWords } from '@/data/vocabulary'
import type { WordData } from '@/data/types'



interface Props {
  onClose: () => void
}

export default function SearchBox({ onClose }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ word: WordData; matchType: string }[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (query.length >= 2) {
      setResults(searchWords(query).slice(0, 8))
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [query])

  const goToWord = (word: string) => {
    router.push(`/word/${word}`)
    onClose()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) {
        goToWord(results[selectedIndex].word.word)
      }
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="max-w-lg mx-auto mt-20 px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="搜索单词..."
                className="flex-1 ml-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 outline-none text-base"
              />
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {results.length > 0 && (
              <div className="py-2">
                {results.map((r, i) => (
                  <button
                    key={r.word.word}
                    onClick={() => goToWord(r.word.word)}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between transition-colors ${
                      i === selectedIndex
                        ? 'bg-primary-50 dark:bg-primary-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {r.word.word}
                      </span>
                      <span className="ml-2 text-xs text-gray-400">{r.word.phonetic}</span>
                    </div>
                    <span className="text-xs text-gray-400">{r.word.meaning}</span>
                  </button>
                ))}
              </div>
            )}
            {query.length >= 2 && results.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                未找到相关单词
              </div>
            )}
            {query.length < 2 && (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                输入至少 2 个字符开始搜索
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
