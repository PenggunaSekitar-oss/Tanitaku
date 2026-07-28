import type { PestisidaItem } from '../data/pestisidaData';

type ScoredItem = {
  item: PestisidaItem;
  score: number;
};

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('id-ID')
    .replace(/[^\p{Letter}\p{Number}]+/gu, ' ')
    .trim();

export function searchPesticides(
  catalog: PestisidaItem[],
  targetQuery: string,
  cropQuery: string,
): PestisidaItem[] {
  const target = normalize(targetQuery);
  const crop = normalize(cropQuery);

  if (!target && !crop) return [...catalog];
  // The catalog records product targets, but it does not contain a verified
  // crop-registration field. A crop-only query therefore cannot be answered
  // accurately and must not produce an arbitrary product list.
  if (!target) return [];

  const matches: ScoredItem[] = [];

  for (const item of catalog) {
    let score = 0;
    const targets = item.sasaran.map(normalize);
    const exactTarget = targets.some((value) => value === target);
    const partialTarget = targets.some(
      (value) => value.includes(target) || target.includes(value),
    );
    const productMatch = normalize(`${item.nama} ${item.bahanAktif}`).includes(target);
    const targetMatches = exactTarget || partialTarget || productMatch;

    if (exactTarget) score += 15;
    else if (partialTarget) score += 8;
    else if (productMatch) score += 5;

    // Crop text can improve ordering when a product description explicitly
    // mentions it, but it must never discard a valid target match. The crop is
    // context for checking the physical label, not a compatibility claim.
    if (targetMatches && crop) {
      const searchableText = normalize(
        `${item.nama} ${item.jenis} ${item.bahanAktif} ${item.kemampuan} ${item.sasaran.join(' ')}`,
      );
      if (searchableText.includes(crop)) score += 2;
    }

    if (targetMatches) matches.push({ item, score });
  }

  return matches
    .sort((a, b) => b.score - a.score || a.item.nama.localeCompare(b.item.nama, 'id-ID'))
    .map(({ item }) => item);
}
