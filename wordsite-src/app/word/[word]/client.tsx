'use client'

import { useEffect, useMemo, useCallback, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { searchWord, getWordsByRoot } from '@/data/vocabulary'
import { getRoot } from '@/data/roots'
import { useStudyRecord } from '@/hooks/useStudyRecord'
import PronunciationButton from '@/components/PronunciationButton'
import { speakWithTTS } from '@/lib/audio'
import type { WordExample } from '@/data/types'

function isTranslated(examples: unknown[]): examples is WordExample[] {
  return examples.length > 0 && typeof examples[0] === 'object' && 'chinese' in (examples[0] as object)
}

export default function WordDetailClient({ word: wordText }: { word: string }) {
  const word = useMemo(() => searchWord(wordText), [wordText])
  const router = useRouter()
  const {
    markCorrect: markCorrectStorage,
    markWrong: markWrongStorage,
    toggleFavorite,
    isFavorite,
    getStatus,
    setStatus,
  } = useStudyRecord()

  const fav = isFavorite(wordText)
  const status = getStatus(wordText)

  const rootData = word?.root ? getRoot(word.root) : undefined
  const rootWords = word?.root ? getWordsByRoot(word.root) : []

  // Button feedback state
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(message)
    toastTimer.current = setTimeout(() => setToast(null), 1500)
  }, [])

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  const handleMarkCorrect = useCallback(() => {
    markCorrectStorage(wordText)
    setFeedback('correct')
    showToast('已标记为认识')
    setTimeout(() => setFeedback(null), 600)
  }, [markCorrectStorage, wordText, showToast])

  const handleMarkWrong = useCallback(() => {
    markWrongStorage(wordText)
    setFeedback('wrong')
    showToast('已标记为不认识')
    setTimeout(() => setFeedback(null), 600)
  }, [markWrongStorage, wordText, showToast])

  useEffect(() => {
    if (word) {
      document.title = `${word.word} - 词根背单词`
    }
  }, [word])

  const handleRelatedWordClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, w: string) => {
      e.preventDefault()
      router.replace(`/word/${w}`)
    },
    [router]
  )

  if (!word) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">单词未找到</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          未找到单词 &quot;{wordText}&quot;
        </p>
        <Link href="/" className="text-primary-600 hover:text-primary-700 font-medium">
          ← 返回首页
        </Link>
      </div>
    )
  }

  const examples = word.examples || []
  const translatedExamples = isTranslated(examples)

  const statusOptions: Array<'not_learned' | 'learning' | 'mastered'> = [
    'not_learned', 'learning', 'mastered',
  ]
  const statusLabels: Record<string, string> = {
    not_learned: '未学习', learning: '学习中', mastered: '已掌握',
  }
  const statusColors: Record<string, string> = {
    not_learned: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
    learning: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    mastered: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-28">
      <motion.div initial={{ opacity: 0, transform: 'translateY(20px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}>
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          返回词库
        </Link>

        {/* ── Word header ── */}
        <div className="mt-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{word.word}</h1>
              <p className="text-sm text-gray-400 mb-1">{word.phonetic}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500 dark:text-gray-400">{word.meaning}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">{word.pos}</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(wordText, e.target.value as typeof status)}
                  className={`text-xs px-2 py-0.5 rounded-md border-0 cursor-pointer ${statusColors[status]}`}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{statusLabels[s]}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={() => toggleFavorite(wordText)}
              className={`p-2 rounded-xl transition-colors ${fav ? 'text-red-400 bg-red-50 dark:bg-red-900/20' : 'text-gray-300 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'}`}
              title={fav ? '取消收藏' : '添加收藏'}
            >
              <svg className="w-6 h-6" fill={fav ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <PronunciationButton word={word.word} region="us" />
            <PronunciationButton word={word.word} region="uk" />
          </div>
        </div>

        {/* ── Etymology + Examples card ── */}
        <section className="mb-8 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          {(word.prefix || word.root || word.suffix) && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">词根词缀拆解</h2>
              <div className="flex flex-wrap items-center gap-2 text-lg font-mono mb-3">
                {word.prefix && (
                  <>
                    <Link href={`/affixes/${word.prefix}`} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">{word.prefix}</Link>
                    <span className="text-gray-300 dark:text-gray-600">+</span>
                  </>
                )}
                {word.root && (
                  <>
                    <Link href={`/roots/${word.root}`} className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">{word.root}</Link>
                    {word.suffix && <span className="text-gray-300 dark:text-gray-600">+</span>}
                  </>
                )}
                {word.suffix && (
                  <Link href={`/affixes/${word.suffix}`} className="text-green-600 dark:text-green-400 font-semibold hover:underline">{word.suffix}</Link>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{word.etymology}</p>
              {word.memory && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
                  <p className="text-sm text-amber-800 dark:text-amber-200"><span className="font-medium">记忆技巧：</span>{word.memory}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Examples — inside the card, right after etymology ── */}
          {examples.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                例句
                <span className="text-gray-400 font-normal ml-1">（{examples.length}）</span>
              </h2>
              <div className="space-y-4">
                {examples.map((ex, i) => {
                  const english = translatedExamples ? (ex as WordExample).english : (ex as string)
                  const chinese = translatedExamples ? (ex as WordExample).chinese : undefined
                  return (
                    <div key={i} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                      <div className="flex items-start gap-3">
                        <span className="text-xs text-gray-300 dark:text-gray-600 mt-0.5 shrink-0 font-mono">{i + 1}</span>
                        <p className="flex-1 text-base text-gray-800 dark:text-gray-200 leading-relaxed">{english}</p>
                        <button onClick={() => speakWithTTS(english, 'en-US')} className="p-1.5 rounded-lg text-gray-300 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors shrink-0" title="朗读例句">
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                          </svg>
                        </button>
                      </div>
                      {chinese && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed pl-7">
                          {chinese}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>

        {/* ── Root family ── */}
        {rootData && rootWords.length > 1 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                词根家族：<Link href={`/roots/${rootData.root}`} className="text-primary-600 hover:text-primary-700">{rootData.root}</Link>
                <span className="text-gray-400 font-normal ml-1">（{rootData.meaning}）</span>
              </h2>
              <Link href={`/roots/${rootData.root}`} className="text-xs text-primary-600 hover:text-primary-700">查看详情 →</Link>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{rootData.meaning} — {rootData.memoryTip}</p>
            <p className="text-xs text-gray-400 mb-3">当前单词 <strong>{word.word}</strong> 在词根家族中（共 {rootWords.length} 个相关单词）</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {rootWords.filter((w) => w.word !== word.word).slice(0, 6).map((w) => (
                <motion.div key={w.word} initial={{ opacity: 0, transform: 'translateY(10px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}>
                  <Link href={`/word/${w.word}`} onClick={(e) => handleRelatedWordClick(e, w.word)} className="block p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{w.word}</h3>
                        <p className="text-xs text-gray-400 mb-1">{w.phonetic}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{w.meaning}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ── Synonyms ── */}
        {word.synonyms && word.synonyms.length > 0 && (
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">近义词</h2>
            <div className="flex flex-wrap gap-2">
              {word.synonyms.map((syn) => (
                <Link key={syn} href={`/word/${syn}`} onClick={(e) => handleRelatedWordClick(e, syn)} className="text-sm px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 hover:text-primary-600 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors">{syn}</Link>
              ))}
            </div>
          </section>
        )}
      </motion.div>

      {/* ── Toast notification ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-medium shadow-lg"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky bottom action bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleMarkCorrect}
            className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-150 active:scale-95
              ${feedback === 'correct'
                ? 'bg-green-600 text-white scale-95 shadow-lg shadow-green-500/25'
                : 'bg-green-500 text-white hover:bg-green-600 hover:shadow-md'
              }
              ${feedback === 'correct' ? 'animate-btn-pop' : ''}
            `}
          >
            {feedback === 'correct' ? '✓ 已标记' : '我认识'}
          </button>
          <button
            onClick={handleMarkWrong}
            className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all duration-150 active:scale-95
              ${feedback === 'wrong'
                ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 scale-95 shadow-lg shadow-gray-300/25'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }
              ${feedback === 'wrong' ? 'animate-btn-shake' : ''}
            `}
          >
            {feedback === 'wrong' ? '✗ 已标记' : '不认识'}
          </button>
        </div>
      </div>

      {/* ── Button animation keyframes ── */}
      <style jsx global>{`
        @keyframes btn-pop {
          0% { transform: scale(1); }
          40% { transform: scale(0.92); }
          70% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        @keyframes btn-shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-3px); }
          30% { transform: translateX(3px); }
          45% { transform: translateX(-2px); }
          60% { transform: translateX(2px); }
          75% { transform: translateX(-1px); }
          90% { transform: translateX(0); }
        }
        .animate-btn-pop {
          animation: btn-pop 0.4s ease-out;
        }
        .animate-btn-shake {
          animation: btn-shake 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
