const audioCache = new Map<string, HTMLAudioElement>()

function freeAudioUrl(word: string, region: 'us' | 'uk'): string {
  const base = 'https://dict.youdao.com/dictvoice'
  const type = region === 'us' ? 0 : 1
  return `${base}?audio=${encodeURIComponent(word)}&type=${type}`
}

export async function playWordAudio(
  word: string,
  region: 'us' | 'uk' = 'us',
  onStateChange?: (state: 'loading' | 'playing' | 'error' | 'idle') => void
): Promise<void> {
  const cacheKey = `${word}_${region}`
  let audio = audioCache.get(cacheKey)

  if (!audio) {
    onStateChange?.('loading')
    audio = new Audio(freeAudioUrl(word, region))
    audio.preload = 'auto'
    audioCache.set(cacheKey, audio)

    try {
      await new Promise<void>((resolve, reject) => {
        audio!.addEventListener('canplaythrough', () => resolve(), { once: true })
        audio!.addEventListener('error', () => reject(new Error('Audio load failed')), {
          once: true,
        })
        audio!.load()
      })
    } catch {
      onStateChange?.('error')
      throw new Error(`Failed to load audio for "${word}"`)
    }
  }

  try {
    audio.currentTime = 0
    await audio.play()
    onStateChange?.('playing')

    await new Promise<void>((resolve) => {
      audio!.addEventListener('ended', () => resolve(), { once: true })
      audio!.addEventListener('error', () => resolve(), { once: true })
    })

    onStateChange?.('idle')
  } catch {
    onStateChange?.('error')
    throw new Error(`Failed to play audio for "${word}"`)
  }
}

export function speakWithTTS(
  text: string,
  lang: 'en-US' | 'en-GB' | 'zh-CN' = 'en-US',
  onStateChange?: (state: 'loading' | 'playing' | 'error' | 'idle') => void
): void {
  if (!('speechSynthesis' in window)) {
    onStateChange?.('error')
    return
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.9
  utterance.pitch = 1

  onStateChange?.('loading')

  utterance.onstart = () => onStateChange?.('playing')
  utterance.onend = () => onStateChange?.('idle')
  utterance.onerror = () => onStateChange?.('error')

  window.speechSynthesis.speak(utterance)
}

export function playWordPronunciation(
  word: string,
  region: 'us' | 'uk' = 'us',
  onStateChange?: (state: 'loading' | 'playing' | 'error' | 'idle') => void
): void {
  playWordAudio(word, region, onStateChange).catch(() => {
    const lang = region === 'us' ? 'en-US' : 'en-GB'
    speakWithTTS(word, lang, onStateChange)
  })
}
