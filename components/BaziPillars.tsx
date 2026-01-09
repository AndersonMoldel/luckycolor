
import React from 'react';
import { BaziResult } from '../types';

interface BaziPillarsProps {
  bazi: BaziResult;
}

const BaziPillars: React.FC<BaziPillarsProps> = ({ bazi }) => {
  // Fix: Explicitly include isKey: false for other pillars to satisfy TypeScript's union type inference
  const pillars = [
    { label: '年柱', ...bazi.year, isKey: false },
    { label: '月柱', ...bazi.month, isKey: false },
    { label: '日柱', ...bazi.day, isKey: true },
    { label: '時柱', ...bazi.time, isKey: false },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 w-full">
      {pillars.map((p, idx) => (
        <div key={idx} className={`flex flex-col items-center p-3 rounded-xl border ${p.isKey ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
          <span className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">{p.label}</span>
          <div className="flex flex-col items-center">
            <span className={`text-3xl font-bold ${p.isKey ? 'text-amber-800' : 'text-slate-800'}`}>{p.gan}</span>
            <span className={`text-3xl font-bold ${p.isKey ? 'text-amber-800' : 'text-slate-800'}`}>{p.zhi}</span>
          </div>
          {p.isKey && <span className="text-[10px] mt-2 text-amber-600 font-bold">本命日主</span>}
        </div>
      ))}
    </div>
  );
};

export default BaziPillars;
