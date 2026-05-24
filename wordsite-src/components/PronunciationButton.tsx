'use client'

import { useState } from 'react'
import { playWordPronunciation } from '@/lib/audio'

interface Props {
  word: string
  region?: 'us' | 'uk'
  className?: string
  size?: 'sm' | 'md'
}

export default function PronunciationButton({ word, region = 'us', className = '', size = 'md' }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'playing' | 'error'>('idle')

  const handleClick = () => {
    playWordPronunciation(word, region, setState)
  }

  const sizeClasses = size === 'sm' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'
  const label = region === 'us' ? 'US' : 'UK'

  return (
    <button
      onClick={handleClick}
      disabled={state === 'loading' || state === 'playing'}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
        state === 'playing'
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 scale-105'
          : state === 'loading'
          ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 animate-pulse'
          : state === 'error'
          ? 'bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400'
          : 'bg-gray-50 text-gray-500 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
      } ${className}`}
      title={`${label} pronunciation`}
    >
      <svg className={sizeClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
      </svg>
      <span>{label}</span>
      {state === 'playing' && (
        <span className="inline-flex gap-0.5 ml-0.5">
          <span className="w-0.5 h-2 bg-current rounded-full animate-bounce" />
          <span className="w-0.5 h-3 bg-current rounded-full animate-bounce [animation-delay:0.1s]" />
          <span className="w-0.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
        </span>
      )}
    </button>
  )
}
