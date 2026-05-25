'use client';
import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react'; 
import { GroupedTafseer } from '@/lib/api'; 

interface AyahBlockProps {
  surahId: number;
  ayahNumber: number;
  textUthmani: string;
  allTafseers: GroupedTafseer[];
  viewMode: 'focused' | 'drawer';         
  selectedBooks: string[];                
  onOpenDrawer: (t: GroupedTafseer) => void; 
}

const TAFSEER_ORDER = [
  "التبيان في تفسير القرآن",
  "تفسير نور الثقلين",
  "تفسير الميزان",
  "تفسير الأمثل",
  "تفسير من وحي القرآن"
];

const sortByMasterOrder = (a: GroupedTafseer, b: GroupedTafseer) => {
  const indexA = TAFSEER_ORDER.indexOf(a.source_book);
  const indexB = TAFSEER_ORDER.indexOf(b.source_book);
  const weightA = indexA === -1 ? 999 : indexA;
  const weightB = indexB === -1 ? 999 : indexB;
  return weightA - weightB;
};

export default function AyahBlock({ 
  surahId, 
  ayahNumber, 
  textUthmani, 
  allTafseers,
  viewMode,
  selectedBooks,
  onOpenDrawer
}: AyahBlockProps) {
  
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  // ✨ This writes your exact location to memory!
  const saveLastRead = () => {
    localStorage.setItem('lastReadSurah', JSON.stringify({ 
      surahId: surahId, 
      ayahNumber: ayahNumber 
    }));
  };

  const toggleAccordion = (bookName: string) => {
    saveLastRead(); // Saves your spot!
    setOpenAccordions(prev => 
      prev.includes(bookName) 
        ? prev.filter(name => name !== bookName)
        : [...prev, bookName]
    );
  };

  const handleDrawerOpen = (t: GroupedTafseer) => {
    saveLastRead(); // Saves your spot!
    onOpenDrawer(t);
  };

  const drawerTafseers = allTafseers
    .filter(t => Number(t.start_ayah) === Number(ayahNumber))
    .sort(sortByMasterOrder);

  const activeTafseers = allTafseers.filter(t => selectedBooks.includes(t.source_book));
  
  const startingTafseers = activeTafseers
    .filter(t => Number(t.start_ayah) === Number(ayahNumber))
    .sort(sortByMasterOrder);
    
  const overlappingTafseers = activeTafseers
    .filter(t => Number(t.start_ayah) < Number(ayahNumber) && Number(t.end_ayah) >= Number(ayahNumber))
    .sort(sortByMasterOrder);

  return (
    <div id={`ayah-${ayahNumber}`} className="scroll-mt-32 bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border-r-8 border-[#064e3b] transition-all duration-300 relative mb-8">
      
      <div className="flex justify-between items-start mb-6">
        <div className="inline-block px-3 py-1 bg-[#fdfbf7] dark:bg-gray-800 border border-[#b4914a] text-[#b4914a] text-xs font-bold rounded-full">
          الآية {ayahNumber}
        </div>
        
        {viewMode === 'drawer' && (
          <div className="flex flex-wrap gap-2 justify-end">
            {drawerTafseers.map((t, idx) => (
              <button 
                key={idx}
                onClick={() => handleDrawerOpen(t)}
                className="flex items-center gap-1 bg-[#fdfbf7] dark:bg-gray-800 hover:bg-[#b4914a] hover:text-white text-[#064e3b] dark:text-[#b4914a] border border-[#b4914a]/30 px-3 py-1 rounded-full text-xs font-bold transition-colors"
              >
                <BookOpen size={14} />
                <span>{t.source_book}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <p className="text-4xl md:text-5xl leading-[2.2] text-[#2d2d2d] dark:text-gray-100 mb-8 text-center font-serif">
        {textUthmani}
      </p>

      {viewMode === 'focused' && (
        <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">
          
          {startingTafseers.map((t, idx) => {
            const isOpen = openAccordions.includes(t.source_book);

            return (
              <div key={idx} className="bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => toggleAccordion(t.source_book)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 text-[#b4914a]">
                    <BookOpen size={18} />
                    <span className="font-bold text-lg">{t.source_book}</span>
                    {t.start_ayah !== t.end_ayah && (
                      <span className="text-xs font-bold bg-[#b4914a]/10 text-[#b4914a] px-2 py-1 rounded-md mr-2">
                        بيان الآيات {t.start_ayah} - {t.end_ayah}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-gray-400 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800/50">
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-justify whitespace-pre-wrap">
                      {t.content}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {overlappingTafseers.length > 0 && startingTafseers.length === 0 && (
            <div className="text-center flex flex-wrap justify-center gap-2 pt-2">
              {overlappingTafseers.map((t, idx) => (
                 <span key={idx} className="text-sm text-gray-400 dark:text-gray-500 italic bg-gray-50 dark:bg-gray-800 px-3 py-1 rounded-full">
                   (تفسير {t.source_book} لهذه الآية مشمول في المقطع السابق)
                 </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}