interface TafseerCardProps {
  scholarName: string;
  sourceBook: string;
  content: string;
}

export default function TafseerCard({ scholarName, sourceBook, content }: TafseerCardProps) {
  return (
    <div className="bg-[#f9f7f2] dark:bg-gray-800/50 p-6 rounded-xl border-r-4 border-[#b4914a] transition-colors duration-300">
      {/* Academic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-[#b4914a]/20 gap-3">
        <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#b4914a]">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="font-bold text-lg font-serif">{sourceBook}</span>
        </div>
        <span className="text-xs font-bold text-[#b4914a] bg-[#b4914a]/10 dark:bg-[#b4914a]/20 px-3 py-1.5 rounded-full whitespace-nowrap">
          {scholarName}
        </span>
      </div>

      {/* Tafseer Content */}
      <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-justify transition-colors">
        {content}
      </p>
    </div>
  );
}