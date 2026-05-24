import { getAllWords } from '@/data/vocabulary'
import WordDetailClient from './client'

export function generateStaticParams() {
  return getAllWords().map((w) => ({ word: w.word }))
}

export default function WordDetailPage({ params }: { params: { word: string } }) {
  return <WordDetailClient word={decodeURIComponent(params.word)} />
}
