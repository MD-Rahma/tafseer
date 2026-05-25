'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getSurahContent, GroupedTafseer, Ayah } from '@/lib/api'; 
import { Settings, X, BookOpen, Layers, CheckCircle2, ArrowRight, Info, ChevronLeft, ChevronRight } from 'lucide-react';

import LoadingPulse from '@/components/LoadingPulse';
import Basmalah from '@/components/Basmalah';
import AyahBlock from '@/components/AyahBlock';

export default function SurahPage() {
  const params = useParams();
  const surahId = params.id as string; 

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [allTafseers, setAllTafseers] = useState<GroupedTafseer[]>([]);
  const [surahInfo, setSurahInfo] = useState<{name: string, type: string, count: number} | null>(null);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState<'focused' | 'drawer'>('focused');
  const [selectedBooks, setSelectedBooks] = useState<string[]>(['تفسير الأمثل']);
  const [activeDrawer, setActiveDrawer] = useState<GroupedTafseer | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // 1. Fetch Data & Safely Read LocalStorage Memory
  useEffect(() => {
    const savedMode = localStorage.getItem('tafseer_viewMode') as 'focused' | 'drawer';
    const savedBooks = localStorage.getItem('tafseer_selectedBooks');
    
    if (savedMode) setViewMode(savedMode);
    if (savedBooks) {
      try { setSelectedBooks(JSON.parse(savedBooks)); } catch (e) {}
    }

    async function loadData() {
      setLoading(true);
      if (surahId) {
        // Fetch the Surah Name & Details instantly from a public API
        try {
          const infoRes = await fetch(`https://api.alquran.cloud/v1/surah/${surahId}`);
          const infoData = await infoRes.json();
          if (infoData.code === 200) {
            setSurahInfo({
              name: infoData.data.name,
              type: infoData.data.revelationType === 'Meccan' ? 'مكية' : 'مدنية',
              count: infoData.data.numberOfAyahs
            });
          }
        } catch (e) {
          console.error("Failed to fetch surah info", e);
        }

        const { ayahs, tafseers } = await getSurahContent(surahId);
        setAyahs(ayahs);
        setAllTafseers(tafseers);

        // Safely set the initial memory if it doesn't exist or is a completely new surah
        const currentSaved = localStorage.getItem('lastReadSurah');
        if (currentSaved) {
          const parsed = JSON.parse(currentSaved);
          if (String(parsed.surahId) !== String(surahId)) {
            localStorage.setItem('lastReadSurah', JSON.stringify({ surahId: surahId, ayahNumber: 1 }));
          }
        } else {
          localStorage.setItem('lastReadSurah', JSON.stringify({ surahId: surahId, ayahNumber: 1 }));
        }
      }
      setLoading(false);
    }
    
    loadData();
  }, [surahId]);

  // 2. 🛡️ BULLETPROOF SCROLLER (The Polling Hound)
  useEffect(() => {
    if (!loading && ayahs.length > 0 && typeof window !== 'undefined') {
      
      let targetId = window.location.hash ? window.location.hash.replace('#', '') : null;

      if (!targetId) {
        const currentSaved = localStorage.getItem('lastReadSurah');
        if (currentSaved) {
          const parsed = JSON.parse(currentSaved);
          if (String(parsed.surahId) === String(surahId) && parsed.ayahNumber > 1) {
            targetId = `ayah-${parsed.ayahNumber}`;
          }
        }
      }

      if (targetId) {
        let attempts = 0;
        
        const hound = setInterval(() => {
          const element = document.getElementById(targetId);

          if (element) {
            clearInterval(hound);

            const y = element.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: y, behavior: 'smooth' });
            
            element.classList.add('ring-4', 'ring-[#b4914a]', 'ring-offset-4', 'dark:ring-offset-gray-950', 'transition-all', 'duration-1000');
            setTimeout(() => {
              element.classList.remove('ring-4', 'ring-[#b4914a]', 'ring-offset-4', 'dark:ring-offset-gray-950');
            }, 2000);
          }

          attempts++;
          if (attempts >= 20) {
            clearInterval(hound);
          }
        }, 100);
      }
    }
  }, [loading, ayahs, surahId]);

  const handleModeChange = (mode: 'focused' | 'drawer') => {
    setViewMode(mode);
    localStorage.setItem('tafseer_viewMode', mode);
  };

  const toggleBook = (book: string) => {
    setSelectedBooks(prev => {
      let newSelection;
      if (prev.includes(book)) {
        newSelection = prev.length > 1 ? prev.filter(b => b !== book) : prev;
      } else {
        newSelection = prev.length >= 2 ? [prev[1], book] : [...prev, book];
      }
      localStorage.setItem('tafseer_selectedBooks', JSON.stringify(newSelection));
      return newSelection;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientY);
  const handleTouchEnd = () => {
    if (touchStart && touchEnd && touchEnd - touchStart > 75) {
      setActiveDrawer(null);
    }
  };

  // 3. ✨ DRAWER NAVIGATION LOGIC
  const navigateDrawer = (newTafseer: GroupedTafseer) => {
    setActiveDrawer(newTafseer);
    // Save new position to memory instantly
    localStorage.setItem('lastReadSurah', JSON.stringify({ 
      surahId: surahId, 
      ayahNumber: newTafseer.start_ayah 
    }));
    
    // Auto-scroll the drawer content back to the top smoothly
    setTimeout(() => {
      const drawerContent = document.getElementById('drawer-content');
      if (drawerContent) drawerContent.scrollTo({ top: 0, behavior: 'smooth' });
    }, 50);
  };

  let currentBookTafseers: GroupedTafseer[] = [];
  let prevTafseer: GroupedTafseer | null = null;
  let nextTafseer: GroupedTafseer | null = null;
  let activeAyahsText = '';

  if (activeDrawer) {
    // 1. Get all Tafseers for this specific book, sorted logically
    currentBookTafseers = allTafseers
      .filter(t => t.source_book === activeDrawer.source_book)
      .sort((a, b) => a.start_ayah - b.start_ayah);

    // 2. Find where we currently are
    const currentIndex = currentBookTafseers.findIndex(t => 
      t.start_ayah === activeDrawer.start_ayah && t.end_ayah === activeDrawer.end_ayah
    );

    // 3. Assign next and previous
    prevTafseer = currentIndex > 0 ? currentBookTafseers[currentIndex - 1] : null;
    nextTafseer = currentIndex !== -1 && currentIndex < currentBookTafseers.length - 1 ? currentBookTafseers[currentIndex + 1] : null;

    // 4. Combine the Uthmani text of the targeted ayah(s) to display in the header!
    activeAyahsText = ayahs
      .filter(a => a.ayah_number >= activeDrawer.start_ayah && a.ayah_number <= activeDrawer.end_ayah)
      .map(a => `${a.text_uthmani} ﴿${a.ayah_number}﴾`)
      .join(' ');
  }

  if (loading) return <LoadingPulse />;

  const availableBooks = Array.from(new Set(allTafseers.map(t => t.source_book)));

  return (
    <main className="max-w-4xl mx-auto space-y-10 p-4 md:p-8 relative">
      
      {/* Sticky Top Navigation Bar */}
      <div className="sticky top-0 z-40 flex justify-between items-center py-4 mb-6 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100/50 dark:border-gray-800/50 -mx-4 px-4 md:-mx-8 md:px-8">
        <Link href="/" className="flex items-center gap-2 bg-[#fdfbf7] dark:bg-gray-800 text-[#064e3b] dark:text-[#b4914a] hover:bg-[#064e3b] hover:text-white dark:hover:bg-[#b4914a] dark:hover:text-white border border-[#064e3b]/20 px-4 py-2 rounded-full shadow-sm transition-all">
          <ArrowRight size={18} />
          <span className="text-sm font-bold">العودة للفهرس</span>
        </Link>

        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:text-[#b4914a] hover:border-[#b4914a] px-4 py-2 rounded-full shadow-sm transition-all"
        >
          <Settings size={18} />
          <span className="text-sm font-bold">إعدادات القراءة</span>
        </button>
      </div>

      {/* Beautiful Surah Info Header */}
      {surahInfo && (
        <div className="bg-linear-to-l from-[#064e3b] to-[#0a6c52] rounded-3xl p-8 md:p-12 text-center text-white mb-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center justify-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif drop-shadow-md">
              {surahInfo.name}
            </h1>
            <div className="flex flex-wrap justify-center gap-3 md:gap-6 text-emerald-50 text-sm md:text-base font-medium">
              <span className="bg-white/10 border border-white/20 px-5 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
                <Info size={16} /> السورة رقم {surahId}
              </span>
              <span className="bg-white/10 border border-white/20 px-5 py-2 rounded-full backdrop-blur-sm">
                آياتها: {surahInfo.count}
              </span>
              <span className="bg-white/10 border border-white/20 px-5 py-2 rounded-full backdrop-blur-sm">
                {surahInfo.type}
              </span>
            </div>
          </div>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4"></div>
        </div>
      )}

      <div>
        {ayahs.length === 0 ? (
          <div className="text-center p-10 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">لم يتم العثور على آيات لهذه السورة بعد.</p>
          </div>
        ) : (
          ayahs.map((ayah) => (
            ayah.ayah_number === 0 
              ? <Basmalah key="basmalah" text={ayah.text_uthmani} />
              : <AyahBlock 
                  key={ayah.ayah_number} 
                  surahId={Number(surahId)}
                  ayahNumber={ayah.ayah_number}
                  textUthmani={ayah.text_uthmani}
                  allTafseers={allTafseers}
                  viewMode={viewMode}
                  selectedBooks={selectedBooks}
                  onOpenDrawer={setActiveDrawer}
                />
          ))
        )}
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl relative border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-bold text-[#064e3b] dark:text-[#b4914a] font-serif">إعدادات القراءة</h3>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">طريقة العرض المفضلة</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleModeChange('focused')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${viewMode === 'focused' ? 'border-[#b4914a] bg-[#b4914a]/10 text-[#064e3b] dark:text-[#b4914a]' : 'border-gray-100 dark:border-gray-800 text-gray-500 hover:border-gray-300'}`}
                  >
                    <BookOpen size={24} />
                    <span className="font-bold text-sm">الوضع المركّز</span>
                  </button>
                  <button 
                    onClick={() => handleModeChange('drawer')}
                    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${viewMode === 'drawer' ? 'border-[#b4914a] bg-[#b4914a]/10 text-[#064e3b] dark:text-[#b4914a]' : 'border-gray-100 dark:border-gray-800 text-gray-500 hover:border-gray-300'}`}
                  >
                    <Layers size={24} />
                    <span className="font-bold text-sm">الدرج المنزلق</span>
                  </button>
                </div>
              </div>

              {availableBooks.length > 0 && viewMode === 'focused' && (
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">التفاسير المعروضة</label>
                    <span className="text-xs text-gray-500">اختر حتى كتابين للمقارنة</span>
                  </div>
                  <div className="space-y-2">
                    {availableBooks.map(book => {
                      const isSelected = selectedBooks.includes(book);
                      return (
                        <button 
                          key={book}
                          onClick={() => toggleBook(book)}
                          className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${isSelected ? 'border-[#064e3b] bg-[#064e3b]/5 dark:border-[#b4914a] dark:bg-[#b4914a]/10' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300'}`}
                        >
                          <span className={`font-bold ${isSelected ? 'text-[#064e3b] dark:text-[#b4914a]' : 'text-gray-600 dark:text-gray-400'}`}>
                            {book}
                          </span>
                          {isSelected && <CheckCircle2 size={18} className="text-[#064e3b] dark:text-[#b4914a]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setIsSettingsOpen(false)} className="w-full mt-8 bg-[#064e3b] hover:bg-[#b4914a] text-white py-3 rounded-xl font-bold transition-colors">
              حفظ وإغلاق
            </button>
          </div>
        </div>
      )}

      {/* ✨ UPGRADED DRAWER MODAL ✨ */}
      {activeDrawer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div 
            className="bg-white dark:bg-gray-900 w-full max-w-2xl sm:rounded-2xl rounded-t-3xl h-[90vh] sm:h-[80vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            
            {/* Mobile Drag Indicator */}
            <div className="w-full flex justify-center pt-3 pb-1 sm:hidden cursor-grab flex-none">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Header: Book Title & The Ayah Text */}
            <div className="flex-none p-4 sm:p-6 border-b border-gray-100 dark:border-gray-800 bg-[#fdfbf7] dark:bg-gray-900 rounded-t-3xl sm:rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-[#064e3b] dark:text-[#b4914a] text-lg font-serif">{activeDrawer.source_book}</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {activeDrawer.start_ayah === activeDrawer.end_ayah 
                      ? `تفسير الآية ${activeDrawer.start_ayah}` 
                      : `بيان الآيات من ${activeDrawer.start_ayah} إلى ${activeDrawer.end_ayah}`}
                  </p>
                </div>
                <button onClick={() => setActiveDrawer(null)} className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors hidden sm:block">
                  <X size={20} />
                </button>
              </div>

              {/* The exact Ayah verse (scrollable if it's a huge block of ayahs) */}
              <div className="mt-5 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-xl sm:text-2xl text-center font-serif text-[#2d2d2d] dark:text-gray-200 leading-[2.2]">
                  {activeAyahsText}
                </p>
              </div>
            </div>

            {/* Body: The actual Tafseer */}
            <div id="drawer-content" className="flex-1 p-6 overflow-y-auto overscroll-contain">
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-loose text-justify whitespace-pre-wrap">
                {activeDrawer.content}
              </p>
            </div>

            {/* Footer: Dynamic Navigation Buttons */}
            <div className="flex-none p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center sm:rounded-b-2xl">
              <button 
                disabled={!nextTafseer}
                onClick={() => nextTafseer && navigateDrawer(nextTafseer)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all ${nextTafseer ? 'bg-[#064e3b] text-white hover:bg-[#b4914a] hover:scale-105 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'}`}
              >
                الآية التالية <ChevronLeft size={18} /> 
              </button>
              
              <button 
                disabled={!prevTafseer}
                onClick={() => prevTafseer && navigateDrawer(prevTafseer)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm transition-all ${prevTafseer ? 'bg-[#064e3b] text-white hover:bg-[#b4914a] hover:scale-105 active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'}`}
              >
                <ChevronRight size={18} /> الآية السابقة
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}