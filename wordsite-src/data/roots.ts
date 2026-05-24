import rootsRaw from './roots.json'
import { RootGroup } from './types'

const rootGroups: RootGroup[] = rootsRaw as RootGroup[]

export function getAllRoots(): RootGroup[] {
  return rootGroups
}

export function getRoot(root: string): RootGroup | undefined {
  return rootGroups.find((r) => r.root === root)
}

export function searchRoot(query: string): RootGroup[] {
  if (!query.trim()) return rootGroups
  const q = query.toLowerCase()
  return rootGroups.filter(
    (r) =>
      r.root.toLowerCase().includes(q) ||
      r.meaning.includes(q) ||
      r.description.toLowerCase().includes(q)
  )
}

export { rootGroups }
