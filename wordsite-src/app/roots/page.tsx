'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getAllRoots } from '@/data/roots'



export default function RootsPage() {
  const [search, setSearch] = useState('')
  const roots = useMemo(() => {
    const all = getAllRoots()
    if (!search.trim()) return all
    const q = search.toLowerCase()
    return all.filter(
      (r) =>
        r.root.toLowerCase().includes(q) ||
        r.meaning.includes(q) ||
        r.description.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">词根列表</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        共 {getAllRoots().length} 个词根，每个词根关联一组相关单词
      </p>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="搜索词根..."
        className="w-full max-w-md mb-6 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:border-primary-400 transition-colors"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {roots.map((root) => (
          <motion.div
            key={root.root}
            initial={{ opacity: 0, transform: 'translateY(10px)' }}
            animate={{ opacity: 1, transform: 'translateY(0px)' }}
          >
            <Link
              href={`/roots/${root.root}`}
              className="block p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-colors group"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {root.root}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{root.meaning}</p>
              <p className="text-xs text-gray-400 mt-2">
                {root.words.length} 个单词
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
