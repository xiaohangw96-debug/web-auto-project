'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useStudyRecord } from '@/hooks/useStudyRecord'



interface WordCardProps {
  word: string
  phonetic: string
  meaning: string
  root?: string
  prefix?: string
  suffix?: string
  showFavorite?: boolean
  className?: string
}

export function WordCardLink({ word, phonetic, meaning, root, prefix, suffix, showFavorite = true, className = '' }: WordCardProps) {
  const { toggleFavorite, isFavorite } = useStudyRecord()
  const fav = isFavorite(word)

  const handleFavClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      toggleFavorite(word)
    },
    [toggleFavorite, word]
  )

  return (
    <Link
      href={`/word/${word}`}
      className={`block p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors group ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {word}
            </h3>
          </div>
          <p className="text-xs text-gray-400 mb-1">{phonetic}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{meaning}</p>
          {(root || prefix || suffix) && (
            <div className="mt-2 flex items-center gap-1.5">
              {prefix && (
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  {prefix}
                </span>
              )}
              {root && (
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                  {root}
                </span>
              )}
              {suffix && (
                <span className="text-xs px-1.5 py-0.5 rounded-md bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                  {suffix}
                </span>
              )}
            </div>
          )}
        </div>
        {showFavorite && (
          <button
            onClick={handleFavClick}
            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
              fav
                ? 'text-red-400 bg-red-50 dark:bg-red-900/20'
                : 'text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
          >
            <svg className="w-4 h-4" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        )}
      </div>
    </Link>
  )
}
