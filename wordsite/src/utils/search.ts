import { Word, SearchResult } from "@/types";
import { words } from "@/data/words";

export type { SearchResult };

export function searchWords(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  for (const word of words) {
    if (word.word.toLowerCase().includes(q)) {
      results.push({ word, matchType: "word" });
      continue;
    }
    if (word.meaning.includes(q)) {
      results.push({ word, matchType: "meaning" });
      continue;
    }
    if (word.root && word.root.toLowerCase().includes(q)) {
      results.push({ word, matchType: "root" });
      continue;
    }
    if (
      (word.prefix && word.prefix.toLowerCase().includes(q)) ||
      (word.suffix && word.suffix.toLowerCase().includes(q))
    ) {
      results.push({ word, matchType: "affix" });
    }
  }

  results.sort((a, b) => {
    const order = { word: 0, meaning: 1, root: 2, affix: 3 };
    const cmp = order[a.matchType] - order[b.matchType];
    if (cmp !== 0) return cmp;
    return a.word.word.localeCompare(b.word.word);
  });

  return results;
}

export function getWordByText(text: string): Word | undefined {
  return words.find(
    (w) => w.word.toLowerCase() === text.toLowerCase()
  );
}

export function getWordsByRoot(root: string): Word[] {
  return words.filter((w) => w.root === root);
}

export function getWordsByAffix(affix: string): Word[] {
  return words.filter((w) => w.prefix === affix || w.suffix === affix);
}

export function getHighFrequencyWords(limit?: number): Word[] {
  return [...words]
    .filter((w) => w.frequency >= 3)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, limit);
}

export function getWordsByLetter(letter: string): Word[] {
  return words
    .filter((w) => w.word.toLowerCase().startsWith(letter.toLowerCase()))
    .sort((a, b) => a.word.localeCompare(b.word));
}
