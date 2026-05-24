import affixesRaw from './affixes.json'
import { AffixData } from './types'

const affixData: AffixData[] = affixesRaw as AffixData[]

export function getAllAffixes(): AffixData[] {
  return affixData
}

export function getAffix(affix: string): AffixData | undefined {
  return affixData.find((a) => a.affix === affix)
}

export function getPrefixes(): AffixData[] {
  return affixData.filter((a) => a.type === 'prefix')
}

export function getSuffixes(): AffixData[] {
  return affixData.filter((a) => a.type === 'suffix')
}

export { affixData }
