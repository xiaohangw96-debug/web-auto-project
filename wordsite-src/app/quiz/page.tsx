'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { getAllWords } from '@/data/vocabulary'
import { useStudyRecord } from '@/hooks/useStudyRecord'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function QuizPage() {
  const { markCorrect, markWrong } = useStudyRecord()
  const allWords = useMemo(() => getAllWords(), [])
  const [quizWords, setQuizWords] = useState<typeof allWords>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showDefinition, setShowDefinition] = useState(false)
  const [known, setKnown] = useState<number | null>(null)
  const [complete, setComplete] = useState(false)

  const startQuiz = useCallback(() => {
    const selected = shuffle(allWords).slice(0, 20)
    setQuizWords(selected)
    setCurrentIndex(0)
    setShowDefinition(false)
    setKnown(null)
    setComplete(false)
  }, [allWords])

  useEffect(() => {
    startQuiz()
  }, [startQuiz])

  if (quizWords.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  if (complete) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">测验完成!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          你已完成 {quizWords.length} 个单词的测验
        </p>
        <button
          onClick={startQuiz}
          className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
        >
          再来一轮
        </button>
      </div>
    )
  }

  const current = quizWords[currentIndex]

  const handleKnow = () => {
    if (known === null) {
      setShowDefinition(true)
      setKnown(0)
    } else {
      markCorrect(current.word)
      nextWord()
    }
  }

  const handleDontKnow = () => {
    if (known === null) {
      setShowDefinition(true)
      setKnown(1)
    } else {
      markWrong(current.word)
      nextWord()
    }
  }

  const nextWord = () => {
    if (currentIndex + 1 >= quizWords.length) {
      setComplete(true)
    } else {
      setCurrentIndex((i) => i + 1)
      setShowDefinition(false)
      setKnown(null)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <p className="text-sm text-gray-400 mb-2">
          第 {currentIndex + 1} / {quizWords.length} 题
        </p>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
          <div
            className="bg-primary-500 h-1.5 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / quizWords.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="text-center py-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          {current.word}
        </h2>
        <p className="text-lg text-gray-400 mb-1">{current.phonetic}</p>

        {showDefinition && (
          <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xl text-gray-800 dark:text-gray-200 font-medium mb-2">
              {current.meaning}
            </p>
            <p className="text-sm text-gray-500">{current.pos}</p>
            {current.etymology && (
              <p className="text-sm text-gray-400 mt-2">{current.etymology}</p>
            )}
            {current.examples && current.examples.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 italic">
                "{typeof current.examples[0] === 'string' ? current.examples[0] : (current.examples[0] as {english: string}).english}"
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleKnow}
          className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors ${
            known === 0
              ? 'bg-green-500 text-white'
              : 'bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400'
          }`}
        >
          {known === null ? '我认识' : '确认认识 ✓'}
        </button>
        <button
          onClick={handleDontKnow}
          className={`flex-1 py-3 rounded-xl font-medium text-sm transition-colors ${
            known === 1
              ? 'bg-red-500 text-white'
              : 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {known === null ? '不认识' : '确认不认识 ✗'}
        </button>
      </div>
    </div>
  )
}
