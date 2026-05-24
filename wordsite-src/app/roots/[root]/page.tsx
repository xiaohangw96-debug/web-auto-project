import { getAllRoots } from '@/data/roots'
import RootDetailClient from './client'

export function generateStaticParams() {
  return getAllRoots().map((r) => ({ root: r.root }))
}

export default function RootDetailPage({ params }: { params: { root: string } }) {
  return <RootDetailClient root={decodeURIComponent(params.root)} />
}
