'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getRoot } from '@/data/roots'
import { getWordsByRoot } from '@/data/vocabulary'
import { WordCardLink } from '@/components/WordCard'



export default function RootDetailClient({ root: rootText }: { root: string }) {
  const rootData = useMemo(() => getRoot(rootText), [rootText])
  const words = useMemo(() => (rootData ? getWordsByRoot(rootData.root) : []), [rootData])

  if (!rootData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">词根未找到</h1>
        <Link href="/roots" className="text-primary-600 hover:text-primary-700 font-medium">← 返回词根列表</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/roots" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">← 返回词根列表</Link>
      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{rootData.root}</h1>
        <p className="text-primary-600 dark:text-primary-400 font-medium">{rootData.meaning}</p>
        <p className="text-sm text-gray-400 mt-1">{rootData.origin}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{rootData.description}</p>
        {rootData.memoryTip && (
          <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30">
            <p className="text-sm text-amber-800 dark:text-amber-200"><span className="font-medium">记忆技巧：</span>{rootData.memoryTip}</p>
          </div>
        )}
      </div>
      <section>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">相关单词（{words.length}）</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {words.map((w) => (
            <motion.div key={w.word} initial={{ opacity: 0, transform: 'translateY(10px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}>
              <WordCardLink word={w.word} phonetic={w.phonetic} meaning={w.meaning} root={w.root} prefix={w.prefix} suffix={w.suffix} />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
