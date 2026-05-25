import type { Metadata } from 'next'
import './globals.css'
import { Providers } from '@/components/Providers'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: '专升本词根背单词 - 用词根词缀理解单词',
  description:
    '通过词根、词缀、词源拆解记忆单词，为专升本考试打造的智能英语词汇学习网站。150+词根、100+词缀、2000+高频词汇。',
  authors: [{ name: 'WordSite' }],
  keywords: ['专升本', '英语单词', '词根', '词缀', '背单词', '词汇学习', '英语考试', '词根记忆法'],
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: '词根背单词',
    statusBarStyle: 'default',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('wordsite_theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="border-t border-gray-100 dark:border-gray-800 py-8 mt-20">
            <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-400 dark:text-gray-600">
              <p>专升本词根背单词 — 用科学方法记住每一个单词</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
