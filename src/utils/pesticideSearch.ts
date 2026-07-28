import type { PestisidaItem } from '../data/pestisidaData';

type ScoredItem = {
  item: PestisidaItem;
  score: number;
};

const normalize = (value: string) => value.trim().toLocaleLowerCase('id-ID');

export function searchPesticides(
  catalog: PestisidaItem[],
  targetQuery: string,
  cropQuery: string,
): PestisidaItem[] {
  const target = normalize(targetQuery);
  const crop = normalize(cropQuery);

  if (!target && !crop) return [...catalog];

  const matches: ScoredItem[] = [];

  for (const item of catalog) {
    let score = 0;
    let targetMatches = !target;
    let cropMatches = !crop;

    if (target) {
      const targets = item.sasaran.map(normalize);
      const exactTarget = targets.some((value) => value === target);
      const partialTarget = targets.some(
        (value) => value.includes(target) || target.includes(value),
      );
      const productMatch = normalize(`${item.nama} ${item.bahanAktif}`).includes(target);

      targetMatches = exactTarget || partialTarget || productMatch;
      if (exactTarget) score += 15;
      else if (partialTarget) score += 8;
      else if (productMatch) score += 5;
    }

    if (crop) {
      const searchableText = normalize(
        `${item.nama} ${item.jenis} ${item.bahanAktif} ${item.kemampuan} ${item.sasaran.join(' ')}`,
      );
      const directCropMatch = searchableText.includes(crop);
      const generalCropMatch = [
        'semua tanaman',
        'berbagai tanaman',
        'hortikultura',
      ].some((phrase) => searchableText.includes(phrase));

      cropMatches = directCropMatch || generalCropMatch;
      if (directCropMatch) score += 10;
      else if (generalCropMatch) score += 4;
    }

    if (targetMatches && cropMatches) matches.push({ item, score });
  }

  return matches
    .sort((a, b) => b.score - a.score || a.item.nama.localeCompare(b.item.nama, 'id-ID'))
    .map(({ item }) => item);
}
