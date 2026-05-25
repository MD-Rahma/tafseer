'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, BookOpen } from 'lucide-react';
import { searchQuranText, Ayah } from '@/lib/api';
import LoadingPulse from '@/components/LoadingPulse';

// ✨ FIX 1: Allow Harakat at the very end of the word before checking for a space!
const createUthmaniRegex = (query: string) => {
  const cleanQuery = query.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  const regexPattern = cleanQuery.split('').map(char => {
    if (/[اأإآٱ]/.test(char)) return '[اأإآٱ]';
    if (/[يى]/.test(char)) return '[يى]';
    if (/[هة]/.test(char)) return '[هة]';
    return char;
  }).join('[\u064B-\u065F\u0670\u06D6-\u06ED]*'); 

  // Capture any trailing vowels or Quranic stop marks at the end of the word
  const harakat = '[\u064B-\u065F\u0670\u06D6-\u06ED]*';
  
  return new RegExp(`(?<=^|\\s)(${regexPattern}${harakat})(?=$|\\s)`, 'gu'); 
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Ayah[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    const data = await searchQuranText(query.trim());
    setResults(data);
    setIsSearching(false);
  };

  // ✨ FIX 2: A bulletproof way to highlight text that bypasses the JS Regex bug
  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;
    try {
      const regex = createUthmaniRegex(searchQuery.trim());
      // Splitting with a capture group automatically puts matches in the ODD indexes
      const parts = text.split(regex);
      
      return (
        <span>
          {parts.map((part, i) => 
            i % 2 !== 0 ? (
              <span key={i} className="bg-[#b4914a]/30 text-[#064e3b] dark:text-[#b4914a] font-bold rounded px-1 transition-colors">
                {part}
              </span>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </span>
      );
    } catch (e) {
      return text;
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-8 md:p-12 min-h-screen">
      <header className="mb-12 text-center">
        <div className="w-16 h-16 bg-[#b4914a]/10 dark:bg-[#b4914a]/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm transition-colors">
          <Search size={32} className="text-[#b4914a]" />
        </div>
        <h1 className="text-4xl font-bold text-[#2d2d2d] dark:text-gray-100 mb-4 font-serif transition-colors">البحث المتقدم</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg transition-colors">ابحث عن أي كلمة بدون الحركات (مثال: الصابرين)</p>
      </header>

      <form onSubmit={handleSearch} className="mb-12 relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث هنا..."
            className="w-full bg-white dark:bg-gray-900 border-2 border-emerald-100 dark:border-gray-800 rounded-2xl py-5 px-6 pr-14 text-xl text-[#2d2d2d] dark:text-white shadow-sm focus:outline-none focus:border-[#b4914a] focus:ring-4 focus:ring-[#b4914a]/10 transition-all font-arabic"
            dir="rtl"
          />
          <button type="submit" disabled={isSearching} className="absolute left-3 bg-[#064e3b] hover:bg-[#b4914a] text-white p-3 rounded-xl transition-colors disabled:opacity-50">
            <Search size={24} />
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {isSearching && <div className="py-10"><LoadingPulse /></div>}
        
        {!isSearching && hasSearched && results.length === 0 && (
          <div className="text-center p-12 bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-800 rounded-2xl transition-colors">
            <p className="text-gray-500 dark:text-gray-400 text-lg">لم يتم العثور على نتائج مطابقة لكلمة "{query}".</p>
          </div>
        )}

        {!isSearching && results.length > 0 && (
          <>
            <p className="text-sm font-bold text-[#b4914a] mb-6 border-b border-gray-100 dark:border-gray-800 pb-4 transition-colors">
              تم العثور على {results.length} آية
            </p>
            <div className="space-y-4">
              {results.map((ayah) => (
                <div key={ayah.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-[#b4914a] dark:hover:border-[#b4914a] transition-all group">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-[#064e3b] dark:text-[#b4914a]">
                      <BookOpen size={16} />
                      <span>سورة {(ayah as any).surahs?.name_ar}</span>
                      <span className="text-gray-400 mx-1">-</span>
                      <span>الآية {ayah.ayah_number}</span>
                    </div>
                  </div>

                  <p className="text-3xl leading-[2.2] text-[#2d2d2d] dark:text-gray-100 font-serif mb-6 text-right transition-colors">
                    {highlightText(ayah.text_uthmani, query)}
                  </p>

                  <div className="flex justify-end mt-4 pt-4 border-t border-gray-50 dark:border-gray-800 transition-colors">
                    <Link href={`/surah/${ayah.surah_id}#ayah-${ayah.ayah_number}`} className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:text-[#b4914a] transition-colors">
                      <span>اقرأ التفسير</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}