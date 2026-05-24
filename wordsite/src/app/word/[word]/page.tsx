import { words } from "@/data/words";
import { WordDetailClient } from "./WordDetailClient";

export function generateStaticParams() {
  return words.map((w) => ({ word: w.word }));
}

export default function WordPage({ params }: { params: { word: string } }) {
  return <WordDetailClient wordText={params.word} />;
}
