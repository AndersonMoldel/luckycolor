
import React, { useState, useCallback, useRef } from 'react';
import { calculateBazi } from './services/baziService';
import { lookupUsefulGods, dedupeElements } from './services/luckyColorService';
import { BaziResult, ElementType } from './types';
import LuckyColorCard from './components/LuckyColorCard';
import { Sparkles, Download, Search, Info, User, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App: React.FC = () => {
  const [name, setName] = useState('陳小明');
  const [gender, setGender] = useState('男');
  const [birthDate, setBirthDate] = useState('1990-01-01');
  const [results, setResults] = useState<{
    usefulElements: ElementType[];
  } | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = useCallback(() => {
    try {
      // Use a default time (12:00) since time input is removed
      const fullDate = new Date(`${birthDate}T12:00:00`);
      const bazi = calculateBazi(fullDate);
      const { usefulElements } = lookupUsefulGods(bazi.day.gan, bazi.month.zhi);
      
      setResults({
        usefulElements: usefulElements as ElementType[]
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "分析發生錯誤");
    }
  }, [birthDate]);

  const exportAsImage = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { 
      scale: 3,
      useCORS: true,
      backgroundColor: '#ffffff'
    });
    const link = document.createElement('a');
    link.download = `${name}_專屬本命幸運色報告.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const exportAsPDF = async () => {
    if (!reportRef.current) return;
    
    const canvas = await html2canvas(reportRef.current, { 
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      windowWidth: reportRef.current.scrollWidth,
      windowHeight: reportRef.current.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; 
    const pageHeight = 297; 
    const imgHeight = (canvas.height * imgWidth) / canvas.width; 
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(`${name}_專屬本命幸運色報告.pdf`);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center bg-slate-50 text-slate-900">
      <header className="max-w-4xl w-full mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="text-amber-500" size={32} />
          <h1 className="text-3xl md:text-4xl font-black text-slate-800">專屬本命幸運色</h1>
        </div>
        <p className="text-slate-500">尋找您的本命色彩能量 · 穿搭與生活開運指南</p>
      </header>

      <main className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Form */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <User size={20} className="text-indigo-500" />
              個人基本資料
            </h2>
            
            <div className="space-y-4 text-black">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">姓名</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="請輸入姓名"
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-white text-black focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">性別</label>
                <div className="flex gap-2">
                  {['男', '女'].map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`flex-1 py-2 rounded-xl border transition-all ${gender === g ? 'bg-indigo-600 border-indigo-600 text-white font-bold' : 'bg-white border-slate-300 text-slate-500 hover:border-indigo-300'}`}
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
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-white text-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <button 
                onClick={handleAnalyze}
                className="w-full bg-slate-900 hover:bg-black text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 transition-all shadow-lg"
              >
                <Search size={20} />
                取得開運色分析
              </button>
            </div>
          </div>

          <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex gap-3">
            <Info className="text-indigo-400 shrink-0" size={20} />
            <p className="text-xs text-indigo-700 leading-relaxed">
              系統將根據您的出生日期，精確比對您的本命五行屬性，並計算出能增強您運勢與心理能量的幸運色系。
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
              <p className="text-slate-400 max-w-xs">請於左側輸入出生資訊，點擊按鈕即可獲得您的開運色彩建議。</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div ref={reportRef} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 space-y-8">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <h2 className="text-2xl font-black mb-1 text-slate-900">{name} 的專屬本命幸運色</h2>
                    <p className="text-sm text-slate-500 font-medium">{birthDate} · {gender}性</p>
                  </div>
                  <div className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-mono text-slate-500 uppercase">
                    Personalized Energy Report
                  </div>
                </div>

                {/* Lucky Colors Only */}
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-2">您的開運色彩建議</h3>
                    <p className="text-sm text-slate-500">以下色系能為您帶來平衡與自信，建議應用於服飾、飾品或居家環境中。</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {dedupeElements(results.usefulElements).map((el, idx) => (
                      <LuckyColorCard key={idx} element={el} />
                    ))}
                  </div>
                </div>

                {/* Footer Note */}
                <div className="pt-6 border-t border-slate-100">
                  <p className="text-[10px] text-slate-400 italic">
                    註：本色彩報告基於您的生辰五行互補原理產生，僅供個人風格與生活開運參考。
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={exportAsImage}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl font-bold transition-all shadow-sm"
                >
                  <Download size={20} />
                  儲存圖片
                </button>
                <button 
                  onClick={exportAsPDF}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg"
                >
                  <Download size={20} />
                  下載 PDF
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-16 mb-8 text-slate-400 text-xs text-center">
        © 2024 Lucky Color Analyst · 專業色彩能量顧問
      </footer>
    </div>
  );
};

export default App;
