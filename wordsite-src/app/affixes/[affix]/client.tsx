'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getAffix } from '@/data/affixes'
import { getWordsByAffix } from '@/data/vocabulary'
import { WordCardLink } from '@/components/WordCard'



export default function AffixDetailClient({ affix: affixText }: { affix: string }) {
  const affixData = useMemo(() => getAffix(affixText), [affixText])
  const words = useMemo(() => (affixData ? getWordsByAffix(affixData.affix) : []), [affixData])

  if (!affixData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">词缀未找到</h1>
        <Link href="/affixes" className="text-primary-600 hover:text-primary-700 font-medium">← 返回词缀列表</Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/affixes" className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">← 返回词缀列表</Link>
      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{affixData.affix}</h1>
          <span className={`text-xs px-2 py-0.5 rounded-md ${affixData.type === 'prefix' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
            {affixData.type === 'prefix' ? '前缀' : '后缀'}
          </span>
        </div>
        <p className="text-primary-600 dark:text-primary-400 font-medium">{affixData.meaning}</p>
        <p className="text-sm text-gray-400 mt-1">{affixData.origin}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">{affixData.description}</p>
        {affixData.examples && affixData.examples.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {affixData.examples.map((ex) => (
              <span key={ex} className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500">{ex}</span>
            ))}
          </div>
        )}
      </div>
      {words.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">使用该词缀的单词（{words.length}）</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {words.map((w) => (
              <motion.div key={w.word} initial={{ opacity: 0, transform: 'translateY(10px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }}>
                <WordCardLink word={w.word} phonetic={w.phonetic} meaning={w.meaning} root={w.root} prefix={w.prefix} suffix={w.suffix} />
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
