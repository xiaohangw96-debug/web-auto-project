import { affixes } from "@/data/affixes";
import { AffixDetailClient } from "./AffixDetailClient";

export function generateStaticParams() {
  return affixes.map((a) => ({ affix: a.affix }));
}

export default function AffixPage({ params }: { params: { affix: string } }) {
  return <AffixDetailClient affixText={params.affix} />;
}
