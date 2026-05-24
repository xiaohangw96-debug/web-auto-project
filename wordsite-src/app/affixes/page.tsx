'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getAllAffixes } from '@/data/affixes'



export default function AffixesPage() {
  const [tab, setTab] = useState<'all' | 'prefix' | 'suffix'>('all')
  const [search, setSearch] = useState('')
  const all = getAllAffixes()

  const filtered = useMemo(() => {
    let list = tab === 'all' ? all : all.filter((a) => a.type === tab)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (a) =>
          a.affix.toLowerCase().includes(q) ||
          a.meaning.includes(q) ||
          a.description.toLowerCase().includes(q)
      )
    }
    return list
  }, [tab, search])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">词缀列表</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        共 {all.length} 个词缀（{all.filter((a) => a.type === 'prefix').length} 前缀 +{' '}
        {all.filter((a) => a.type === 'suffix').length} 后缀）
      </p>

      <div className="flex items-center gap-2 mb-4">
        {(['all', 'prefix', 'suffix'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t === 'all' ? '全部' : t === 'prefix' ? '前缀' : '后缀'}
          </button>
        ))}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索词缀..."
          className="flex-1 max-w-xs ml-auto px-4 py-1.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary-400 transition-colors text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filtered.map((a) => (
          <motion.div
            key={a.affix}
            initial={{ opacity: 0, transform: 'translateY(10px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
          >
            <Link
              href={`/affixes/${a.affix}`}
              className="block p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors group"
            >
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {a.affix}
                </h3>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-md ${
                    a.type === 'prefix'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                  }`}
                >
                  {a.type === 'prefix' ? '前缀' : '后缀'}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{a.meaning}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
