
export interface BaziPillar {
  gan: string;
  zhi: string;
}

export interface BaziResult {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  time: BaziPillar;
}

export interface ElementInfo {
  color: string;
  palette: string;
  description?: string;
}

export interface LuckyColorReport {
  name: string;
  gender: string;
  birthDate: string;
  bazi: BaziResult;
  usefulGans: string[];
  usefulElements: string[];
  process: string[];
}

export type ElementType = "木" | "火" | "土" | "金" | "水";
