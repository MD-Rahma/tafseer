'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, BookOpen, Clock, Library, Sparkles, Quote } from 'lucide-react';

const getArabicType = (type: string) => {
  if (type.toLowerCase() === 'meccan') return 'مكية';
  if (type.toLowerCase() === 'medinan') return 'مدنية';
  return type;
};

// The exact IDs of the 15 Surahs that contain a Sajda (Prostration)
const SAJDA_SURAHS = [7, 13, 16, 17, 19, 22, 25, 27, 32, 38, 41, 53, 84, 96];

export default function HomeDashboard({ surahs }: { surahs: any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'meccan' | 'medinan' | 'short' | 'sajda'>('all');
  const [lastRead, setLastRead] = useState<{ surahId: string, surahName: string, ayahNumber: number } | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lastReadSurah');
    if (saved) {
      const parsedData = JSON.parse(saved);
      const surahData = surahs.find(s => s.id.toString() === parsedData.surahId.toString());
      
      setLastRead({
        surahId: parsedData.surahId,
        surahName: surahData ? surahData.name_ar : parsedData.surahId,
        ayahNumber: parsedData.ayahNumber || 1
      });
    }
  }, [surahs]);

  // Combined Search and Filter Logic
  const filteredSurahs = surahs.filter((surah) => {
    // 1. Text Search
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      surah.name_ar.includes(query) ||
      surah.id.toString().includes(query) ||
      (surah.name_en && surah.name_en.toLowerCase().includes(query)) ||
      (surah.name_simple && surah.name_simple.toLowerCase().includes(query));

    // 2. Category Filter
    let matchesFilter = true;
    if (activeFilter === 'meccan') matchesFilter = surah.type.toLowerCase() === 'meccan';
    if (activeFilter === 'medinan') matchesFilter = surah.type.toLowerCase() === 'medinan';
    if (activeFilter === 'short') matchesFilter = surah.total_ayahs <= 20; // Surahs with 20 verses or less
    if (activeFilter === 'sajda') matchesFilter = SAJDA_SURAHS.includes(surah.id);

    return matchesSearch && matchesFilter;
  });

  return (
    <main className="p-8 md:p-12 max-w-7xl mx-auto space-y-10">
      
      {/* 🌟 HERO SECTION: Tafseer Showcase */}
      <div className="bg-linear-to-l from-[#064e3b] to-[#0a6c52] rounded-3xl p-8 md:p-12 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">مكتبة التفسير الشاملة</h1>
          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
            استكشف معاني القرآن الكريم من خلال أمهات كتب التفسير. تنقل بسلاسة بين الرؤى الكلاسيكية، الفلسفية، الروائية، والمعاصرة في منصة واحدة.
          </p>
          <div className="flex flex-wrap gap-3">
            {["التبيان", "الميزان", "نور الثقلين", "الأمثل", "من وحي القرآن"].map((book, idx) => (
              <span key={idx} className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                <BookOpen size={16} />
                {book}
              </span>
            ))}
          </div>
        </div>
        <Library className="absolute -left-10 -bottom-10 text-white/5 w-64 h-64 -rotate-12" />
      </div>

      {/* 📖 CONTINUE READING & AYAH OF THE DAY ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Ayah of the Day Widget */}
        <div className="lg:col-span-2 bg-[#fdfbf7] dark:bg-gray-900 border border-[#b4914a]/30 rounded-3xl p-8 relative overflow-hidden shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 text-[#b4914a] mb-4">
            <Sparkles size={20} />
            <h3 className="font-bold text-sm">آية اليوم</h3>
          </div>
          <Quote className="absolute top-8 left-8 text-[#b4914a]/10 w-24 h-24 rotate-180" />
          <p className="text-2xl md:text-4xl text-[#064e3b] dark:text-[#b4914a] font-serif leading-loose mb-6 text-center z-10">
            "إِنَّ مَعَ الْعُسْرِ يُسْرًا"
          </p>
          <div className="flex justify-between items-end z-10">
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-md">
              تأكيد إلهي عظيم بأن الفرج يصاحب الضيق، وأن كل شدة تمر بالإنسان تحمل في طياتها بذور الخلاص واليسر.
            </p>
            <Link href="/surah/94" className="text-xs font-bold bg-[#064e3b] text-white px-4 py-2 rounded-full hover:bg-[#b4914a] transition-colors">
              سورة الشرح
            </Link>
          </div>
        </div>

        {/* Continue Reading Widget */}
        {lastRead ? (
          <Link href={`/surah/${lastRead.surahId}#ayah-${lastRead.ayahNumber}`} className="h-full">
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-[#b4914a] dark:hover:border-[#b4914a] rounded-3xl p-8 flex flex-col justify-center h-full transition-all group shadow-sm cursor-pointer relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-[#b4914a] group-hover:w-3 transition-all"></div>
              <div className="bg-[#b4914a]/10 text-[#b4914a] p-4 rounded-2xl w-fit mb-6 group-hover:bg-[#b4914a] group-hover:text-white transition-colors">
                <Clock size={28} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-bold mb-2">متابعة القراءة</p>
              <p className="text-2xl font-bold text-[#064e3b] dark:text-emerald-400 mb-1">
                سورة {lastRead.surahName}
              </p>
              <p className="text-gray-400 dark:text-gray-500">الآية {lastRead.ayahNumber}</p>
            </div>
          </Link>
        ) : (
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-8 flex flex-col items-center justify-center text-center h-full shadow-sm">
            <div className="bg-gray-50 dark:bg-gray-900 text-gray-300 dark:text-gray-600 p-4 rounded-2xl w-fit mb-4">
              <Clock size={28} />
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-bold">لم تبدأ القراءة بعد</p>
            <p className="text-xs text-gray-400 mt-2">اختر سورة من الفهرس للبدء</p>
          </div>
        )}
      </div>

      {/* 🔍 SEARCH AND FILTERS */}
      <div className="space-y-4 pt-6">
        
        {/* Smart Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
            <Search size={20} />
          </div>
          <input
            type="text"
            className="w-full bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 focus:border-[#b4914a] dark:focus:border-[#b4914a] outline-none rounded-2xl py-4 pr-12 pl-4 text-gray-700 dark:text-gray-200 transition-all shadow-sm"
            placeholder="ابحث عن سورة (مثال: الناس، 114)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* 🎛️ Quick Filters Row */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'meccan', label: 'مكية' },
            { id: 'medinan', label: 'مدنية' },
            { id: 'short', label: 'القصار' },
            { id: 'sajda', label: 'مواضع السجود' }
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as any)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                activeFilter === filter.id 
                  ? 'bg-[#064e3b] text-white border-transparent' 
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-[#b4914a] hover:text-[#b4914a]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* 📚 SURAH GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredSurahs.map((surah) => (
          <Link href={`/surah/${surah.id}`} key={surah.id}>
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 hover:shadow-lg hover:border-[#b4914a] dark:hover:border-[#b4914a] transition-all duration-300 cursor-pointer flex items-center justify-between group h-full">
              
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#f9f7f2] dark:bg-gray-800 text-[#b4914a] rounded-xl flex items-center justify-center font-bold text-xl border border-[#b4914a]/20 group-hover:bg-[#b4914a] group-hover:text-white transition-colors shadow-sm">
                  {surah.id}
                </div>
                <div>
                  <h2 className="font-bold text-2xl text-[#2d2d2d] dark:text-gray-100 group-hover:text-[#064e3b] dark:group-hover:text-emerald-400 transition-colors mb-1">
                    {surah.name_ar}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      {getArabicType(surah.type)} • {surah.total_ayahs} آية
                    </p>
                    {/* Tiny Sajda indicator on the card itself */}
                    {SAJDA_SURAHS.includes(surah.id) && (
                      <span className="text-[10px] bg-[#b4914a]/10 text-[#b4914a] px-2 py-0.5 rounded-full font-bold">
                        سجدة
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-gray-300 dark:text-gray-600 group-hover:text-[#b4914a] transition-transform group-hover:-translate-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </div>

            </div>
          </Link>
        ))}
        
        {filteredSurahs.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            لم يتم العثور على سور تطابق بحثك.
          </div>
        )}
      </div>
    </main>
  );
}