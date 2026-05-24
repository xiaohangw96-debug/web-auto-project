/**
 * Batch translate example sentences using MyMemory free API.
 * Usage: npx ts-node scripts/batch-translate.ts
 */

import https from 'https'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DELAY_MS = 300

function translateText(text: string): Promise<string> {
  return new Promise((resolve) => {
    const q = encodeURIComponent(text)
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${q}`
    https.get(url, (res) => {
      let body = ''
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => {
        try {
          const json = JSON.parse(body)
          const translations = json?.[0]
          if (translations && translations.length > 0) {
            const translated = translations.map((t: any[]) => t[0]).join('')
            resolve(translated)
          } else {
            resolve(`[未翻译] ${text}`)
          }
        } catch {
          resolve(`[未翻译] ${text}`)
        }
      })
    }).on('error', () => resolve(`[未翻译] ${text}`))
  })
}

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

async function main() {
  const vocabPath = path.join(__dirname, '..', 'data', 'vocabulary.json')

  const vocab: any[] = JSON.parse(fs.readFileSync(vocabPath, 'utf-8'))

  // Extract untranslated sentences directly from vocab
  const untranslatedSet = new Set<string>()
  for (const word of vocab) {
    for (const ex of word.examples) {
      if (ex.chinese && (ex.chinese.startsWith('[待翻译]') || ex.chinese.startsWith('[未翻译]'))) {
        untranslatedSet.add(ex.english)
      }
    }
  }
  const untranslated = Array.from(untranslatedSet)

  // Build translation map from existing translations first
  const existingMap: Record<string, string> = {}
  for (const word of vocab) {
    for (const ex of word.examples) {
      if (ex.chinese && !ex.chinese.startsWith('[待翻译]') && !ex.chinese.startsWith('[未翻译]')) {
        existingMap[ex.english] = ex.chinese
      }
    }
  }

  console.log(`Existing translations: ${Object.keys(existingMap).length}`)
  console.log(`Sentences to translate: ${untranslated.length}`)

  const newMap: Record<string, string> = { ...existingMap }
  let done = 0
  const batchSize = 10

  for (let i = 0; i < untranslated.length; i += batchSize) {
    const batch = untranslated.slice(i, i + batchSize)
    const results = await Promise.all(batch.map((text) => translateText(text)))

    for (let j = 0; j < batch.length; j++) {
      if (!newMap[batch[j]]) {
        newMap[batch[j]] = results[j]
      }
      done++
    }

    if (done % 50 === 0 || done === untranslated.length) {
      console.log(`  Progress: ${done}/${untranslated.length}`)
    }

    if (i + batchSize < untranslated.length) {
      await sleep(DELAY_MS)
    }
  }

  // Apply translations to vocabulary
  let appliedCount = 0
  for (const word of vocab) {
    for (const ex of word.examples) {
      if (ex.chinese && (ex.chinese.startsWith('[待翻译]') || ex.chinese.startsWith('[未翻译]'))) {
        if (newMap[ex.english] && !newMap[ex.english].startsWith('[未翻译]')) {
          ex.chinese = newMap[ex.english]
          appliedCount++
        }
      }
    }
  }

  fs.writeFileSync(vocabPath, JSON.stringify(vocab, null, 2))
  console.log(`\nDone! Applied ${appliedCount} new translations.`)
  console.log(`Total translation map: ${Object.keys(newMap).length} entries.`)
}

main().catch(console.error)
