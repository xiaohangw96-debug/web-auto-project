'use client'

import { useState, useCallback } from 'react'
import {
  getRecord,
  setRecord,
  markCorrect as markCorrectStorage,
  markWrong as markWrongStorage,
  toggleFavorite as toggleFavStorage,
  isFavorite as isFavStorage,
  loadRecords,
  saveRecords,
  type StudyRecord,
  type WordStatus,
} from '@/lib/storage'

export function useStudyRecord() {
  const [, forceUpdate] = useState(0)

  const refresh = useCallback(() => forceUpdate((n) => n + 1), [])

  const markCorrect = useCallback((word: string) => {
    markCorrectStorage(word)
    refresh()
  }, [refresh])

  const markWrong = useCallback((word: string) => {
    markWrongStorage(word)
    refresh()
  }, [refresh])

  const toggleFavorite = useCallback(
    (word: string): boolean => {
      const result = toggleFavStorage(word)
      refresh()
      return result
    },
    [refresh]
  )

  const isFavorite = useCallback((word: string): boolean => {
    return isFavStorage(word)
  }, [])

  const getStatus = useCallback((word: string): WordStatus => {
    return getRecord(word).status
  }, [])

  const setStatus = useCallback(
    (word: string, status: WordStatus) => {
      const record = getRecord(word)
      record.status = status
      setRecord(record)
      refresh()
    },
    [refresh]
  )

  const records = loadRecords()

  return {
    markCorrect,
    markWrong,
    toggleFavorite,
    isFavorite,
    getStatus,
    setStatus,
    records,
  }
}
