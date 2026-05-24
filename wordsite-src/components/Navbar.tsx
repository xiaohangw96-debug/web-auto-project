'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useTheme } from './Providers'
import SearchBox from './SearchBox'
import { getFavoriteWords } from '@/lib/storage'

const navLinks = [
  { href: '/', label: '首页' },
  { href: '/roots', label: '词根' },
  { href: '/affixes', label: '词缀' },
  { href: '/high-frequency', label: '高频词' },
  { href: '/quiz', label: '测试' },
  { href: '/review', label: '复习' },
  { href: '/favorites', label: '收藏' },
]

const basePath = '/web-auto-project/wordsite'

export default function Navbar() {
  const pathname = usePathname()
  const { theme, toggle } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [favCount, setFavCount] = useState(0)

  useEffect(() => {
    setFavCount(getFavoriteWords().length)
    const handler = () => setFavCount(getFavoriteWords().length)
    window.addEventListener('storage', handler)
    window.addEventListener('focus', () => setFavCount(getFavoriteWords().length))
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener('focus', () => {})
    }
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return pathname === basePath || pathname === '/'
    return pathname.startsWith(href) || pathname.startsWith(basePath + href)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-gray-900 dark:text-white"
          >
            <span className="text-primary-600">词根</span>背单词
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  isActive(link.href)
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {link.label}
                {link.href === '/favorites' && favCount > 0 && (
                  <span className="ml-1 text-xs text-primary-500">({favCount})</span>
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="搜索"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="切换暗黑模式"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="菜单"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(link.href)
                    ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                {link.label}
                {link.href === '/favorites' && favCount > 0 && (
                  <span className="ml-1 text-xs text-primary-500">({favCount})</span>
                )}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {searchOpen && <SearchBox onClose={() => setSearchOpen(false)} />}
    </>
  )
}
