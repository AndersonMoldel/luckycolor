
import React, { useState, useCallback, useRef } from 'react';
import { calculateBazi } from './services/baziService';
import { lookupUsefulGods, dedupeElements } from './services/luckyColorService';
import { BaziResult, ElementType } from './types';
import BaziPillars from './components/BaziPillars';
import LuckyColorCard from './components/LuckyColorCard';
import { Sparkles, Download, Search, Info, User, Calendar, Clock } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [name, setName] = useState('陳小明');
  const [gender, setGender] = useState('男');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [birthTime, setBirthTime] = useState('12:00');
  const [results, setResults] = useState<{
    bazi: BaziResult;
    usefulGans: string[];
    usefulElements: ElementType[];
    process: string[];
  } | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = useCallback(() => {
    try {
      const fullDate = new Date(`${birthDate}T${birthTime}`);
      const bazi = calculateBazi(fullDate);
      const { usefulGans, usefulElements, process } = lookupUsefulGods(bazi.day.gan, bazi.month.zhi);
      
      setResults({
        bazi,
        usefulGans,
        usefulElements: usefulElements as ElementType[],
        process
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "分析發生錯誤");
    }
  }, [birthDate, birthTime]);

  const exportAsImage = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { 
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    const link = document.createElement('a');
    link.download = `${name}_幸運色報告.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const exportAsPDF = async () => {
    if (!reportRef.current) return;
    
    // 建立截圖
    const canvas = await html2canvas(reportRef.current, { 
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: reportRef.current.scrollWidth,
      windowHeight: reportRef.current.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 寬度 mm
    const pageHeight = 297; // A4 高度 mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // 轉換後的總高度
    
    let heightLeft = imgHeight;
    let position = 0;

    // 第一頁
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // 如果高度超過一頁，則分頁處理
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`${name}_幸運色報告.pdf`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-slate-50 text-slate-900">
      <header className="max-w-4xl w-full mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="text-amber-500" size={32} />
          <h1 className="text-3xl md:text-4xl font-black text-slate-800">命理幸運色分析</h1>
        </div>
        <p className="text-slate-500">專業八字查表版 · 尋找您的本命喜用神與色彩能量</p>
      </header>

      <main className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User size={20} className="text-indigo-500" />
              個人基本資料
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">姓名</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">性別</label>
                <div className="flex gap-2">
                  {['男', '女'].map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-2 rounded-xl border transition-all ${gender === g ? 'bg-indigo-50 border-indigo-200 text-indigo-600 font-bold' : 'bg-white border-slate-200 text-slate-500'}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">出生日期</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input 
                    type="date" 
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">出生時間</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                  <input 
                    type="time" 
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 transition-all shadow-lg"
              >
                <Search size={20} />
                開始精準分析
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex gap-3">
            <Info className="text-indigo-400 shrink-0" size={20} />
            <p className="text-xs text-indigo-700 leading-relaxed">
              本工具採用傳統命理「查表法」，僅依據日干與月支對照表判定喜用神。此為命理入門與色彩穿搭最常用的權威基準。
            </p>
          </div>
        </section>

        {/* Right: Results Display */}
        <section className="lg:col-span-7 space-y-6">
          {!results ? (
            <div className="bg-white rounded-3xl p-12 flex flex-col items-center justify-center text-center border border-dashed border-slate-300 h-full min-h-[400px]">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <Sparkles size={48} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-400">尚未產生分析結果</h3>
              <p className="text-slate-400 max-w-xs">請於左側輸入出生資訊，點擊分析按鈕即可獲得您的專屬報告。</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div ref={reportRef} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-8">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <h2 className="text-2xl font-black mb-1">{name} 的命理分析報告</h2>
                    <p className="text-sm text-slate-500">{birthDate} {birthTime} · {gender}性</p>
                  </div>
                  <div className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-mono text-slate-500">
                    REF: LOOKUP_V1.0
                  </div>
                </div>

                {/* Bazi Section */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">八字命盤</h3>
                  <BaziPillars bazi={results.bazi} />
                </div>

                {/* Process Log */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-4 bg-indigo-500 rounded-full"></div>
                    判斷邏輯過程
                  </h3>
                  <ul className="space-y-2">
                    {results.process.map((step, i) => (
                      <li key={i} className="text-xs text-slate-600 font-medium flex gap-3">
                        <span className="text-slate-300">{i + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Lucky Colors */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">本命幸運色卡</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {dedupeElements(results.usefulElements).map((el, idx) => (
                      <LuckyColorCard key={idx} element={el} />
                    ))}
                  </div>
                </div>

                {/* Footer Note */}
                <div className="pt-6 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 italic">
                    註：本報告僅供參考，喜用神依『日干+月支對照表』查得。
                  </p>
                </div>
              </div>

              {/* Action Buttons (Outside Ref to avoid appearing in export) */}
              <div className="flex gap-4">
                <button 
                  onClick={exportAsImage}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold transition-all shadow-sm"
                >
                  <Download size={20} />
                  儲存為圖片
                </button>
                <button 
                  onClick={exportAsPDF}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg"
                >
                  <Download size={20} />
                  下載完整 PDF
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-16 mb-8 text-slate-400 text-xs text-center">
        © 2024 Bazi Analyst · 專業命理色彩顧問 · 基於傳統查表法
      </footer>
    </div>
  );
};

export default App;
