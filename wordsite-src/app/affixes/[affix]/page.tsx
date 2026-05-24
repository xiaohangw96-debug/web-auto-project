import { getAllAffixes } from '@/data/affixes'
import AffixDetailClient from './client'

export function generateStaticParams() {
  return getAllAffixes().map((a) => ({ affix: a.affix }))
}

export default function AffixDetailPage({ params }: { params: { affix: string } }) {
  return <AffixDetailClient affix={decodeURIComponent(params.affix)} />
}
