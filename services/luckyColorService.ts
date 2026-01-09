
import { USEFUL_GOD_TABLE, GAN_TO_ELEMENT, ELEMENT_CONFIG } from '../constants';
import { ElementType } from '../types';

export const lookupUsefulGods = (dayGan: string, monthZhi: string) => {
  if (!USEFUL_GOD_TABLE[dayGan]) {
    throw new Error(`Missing lookup data for Day Stem: ${dayGan}`);
  }
  const rawResult = USEFUL_GOD_TABLE[dayGan][monthZhi];
  if (!rawResult) {
    throw new Error(`Missing lookup data for Day Stem ${dayGan} and Month Branch ${monthZhi}`);
  }

  // Normalize "王" to "壬" if it exists (common typo in tables)
  const normalized = rawResult.replace(/王/g, '壬');
  const usefulGans = normalized.split('');
  const usefulElements = usefulGans.map(gan => GAN_TO_ELEMENT[gan]);

  const process = [
    `步驟 1：識別日干 = ${dayGan}`,
    `步驟 2：識別月支 = ${monthZhi}`,
    `步驟 3：查表得出喜用神天干 = ${normalized}`,
    `步驟 4：將天干轉換為五行 = ${usefulGans.map(g => `${g}→${GAN_TO_ELEMENT[g]}`).join(', ')}`,
    `步驟 5：五行對應色系 = ${usefulElements.map(e => `${e}(${ELEMENT_CONFIG[e].palette})`).join(', ')}`
  ];

  return {
    usefulGans,
    usefulElements,
    process
  };
};

export const dedupeElements = (elements: ElementType[]): ElementType[] => {
  return Array.from(new Set(elements));
};
