
import { Solar, Lunar } from 'lunar-javascript';
import { BaziResult, BaziPillar } from '../types';

export const calculateBazi = (date: Date): BaziResult => {
  const solar = Solar.fromDate(date);
  const lunar = Lunar.fromSolar(solar);
  const eightChar = lunar.getEightChar();

  return {
    year: { gan: eightChar.getYearGan(), zhi: eightChar.getYearZhi() },
    month: { gan: eightChar.getMonthGan(), zhi: eightChar.getMonthZhi() },
    day: { gan: eightChar.getDayGan(), zhi: eightChar.getDayZhi() },
    time: { gan: eightChar.getTimeGan(), zhi: eightChar.getTimeZhi() },
  };
};

export const formatBaziString = (bazi: BaziResult): string => {
  return `${bazi.year.gan}${bazi.year.zhi} ${bazi.month.gan}${bazi.month.zhi} ${bazi.day.gan}${bazi.day.zhi} ${bazi.time.gan}${bazi.time.zhi}`;
};
