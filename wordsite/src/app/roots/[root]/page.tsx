import { roots } from "@/data/roots";
import { RootDetailClient } from "./RootDetailClient";

export function generateStaticParams() {
  return roots.map((r) => ({ root: r.root }));
}

export default function RootPage({ params }: { params: { root: string } }) {
  return <RootDetailClient rootText={params.root} />;
}
