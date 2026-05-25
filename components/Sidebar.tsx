'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Search, BookOpen, Info, MessageSquare } from "lucide-react";

export default function Sidebar() {
  const [isDesktopOpen, setIsDesktopOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false); 
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/' || pathname?.startsWith('/surah');
    }
    return pathname === href;
  };

  const navItems = [
    { name: "فهرس السور", href: "/", icon: BookOpen },
    { name: "البحث المتقدم", href: "/search", icon: Search },
    { name: "عن المشروع", href: "/about", icon: Info },
    { name: "اتصل بنا", href: "/contact", icon: MessageSquare },
  ];

  return (
    <>
      {/* 📱 Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 w-full bg-[#064e3b] dark:bg-gray-950 flex items-center justify-between p-4 shadow-md text-white border-b border-emerald-800/30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#b4914a] rounded-full flex items-center justify-center shadow-lg">
            <BookOpen size={16} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#b4914a] font-serif">تفسير الميزان</h1>
        </div>
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-[#04382a] dark:bg-gray-900 rounded-lg hover:text-[#b4914a] transition-colors focus:outline-none"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 📱 Mobile Backdrop (Clicking outside closes it) */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* 💻 + 📱 The Sidebar itself */}
      <aside 
        className={`
          /* FIX: Changed h-screen to h-[100dvh] so it doesn't hide behind mobile address bars */
          fixed inset-y-0 right-0 z-50 flex flex-col h-[100dvh] shadow-2xl bg-[#064e3b] dark:bg-gray-950 text-white 
          transition-transform duration-300 ease-in-out transform
          ${isMobileOpen ? "translate-x-0" : "translate-x-full"}
          md:translate-x-0 md:sticky md:top-0
          w-72 ${isDesktopOpen ? "md:w-72" : "md:w-20"}
        `}
      >
        {/* Desktop Collapse Button */}
        <button 
          onClick={() => setIsDesktopOpen(!isDesktopOpen)}
          className="absolute -left-4 top-8 bg-[#b4914a] text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform z-50 hidden md:block"
        >
          {isDesktopOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        {/* FIX: Mobile Close Button (Bigger touch target, higher z-index) */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="absolute left-4 top-4 p-2 bg-black/20 rounded-full text-white hover:bg-black/40 transition-colors z-50 md:hidden"
        >
          <X size={24} />
        </button>

        {/* Sidebar Header */}
        <div className={`shrink-0 border-b border-emerald-800/50 dark:border-gray-800 text-center transition-all flex flex-col items-center justify-center ${
          isDesktopOpen ? "p-6" : "py-6 px-2 overflow-hidden md:p-6" 
        }`}>
          <div className="w-12 h-12 bg-[#b4914a] rounded-full flex items-center justify-center shadow-lg">
            <BookOpen className="text-white" size={24} />
          </div>
          <div className={`animate-in fade-in duration-300 mt-3 ${!isDesktopOpen ? 'md:hidden' : ''}`}>
            <h1 className="text-2xl font-bold text-[#b4914a] font-serif whitespace-nowrap">تفسير الميزان</h1>
          </div>
        </div>
        
        {/* Sidebar Links */}
        <nav className={`flex-1 space-y-3 mt-4 overflow-y-auto ${isDesktopOpen ? "p-4" : "p-2 md:p-4"}`}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link 
                key={item.href}
                href={item.href} 
                title={item.name}
                onClick={() => setIsMobileOpen(false)} 
                className={`flex items-center ${isDesktopOpen ? "gap-4 px-4" : "justify-center md:justify-start md:px-4 md:gap-4"} py-3 rounded-xl transition-all whitespace-nowrap ${
                  active 
                    ? `bg-[#04382a] dark:bg-gray-900 text-[#b4914a] font-bold border-[#b4914a] opacity-100 ${isDesktopOpen ? "border-r-4" : "md:border-r-0 border-r-4"}` 
                    : `hover:bg-[#04382a]/50 dark:hover:bg-gray-900 text-emerald-100 opacity-70 hover:opacity-100`
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className={`${!isDesktopOpen ? 'md:hidden' : ''}`}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* FIX: Theme Toggle (Forced to bottom, extra padding for mobile swipe bars) */}
        <div className={`shrink-0 border-t border-emerald-800/50 dark:border-gray-800 flex justify-center transition-all pb-8 md:pb-4 ${isDesktopOpen ? "p-4" : "p-2 py-4 md:p-4"}`}>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`flex items-center ${isDesktopOpen ? "justify-center gap-2 w-full px-4" : "justify-center w-12 md:w-full md:px-4 md:gap-2"} py-3 rounded-xl bg-[#04382a] dark:bg-gray-900 hover:bg-[#b4914a] text-emerald-100 hover:text-white transition-all`}
              title={theme === 'dark' ? "Light Mode" : "Dark Mode"}
            >
              {theme === 'dark' ? <Sun size={20} className="shrink-0" /> : <Moon size={20} className="shrink-0" />}
              <span className={`font-medium whitespace-nowrap ${!isDesktopOpen ? 'md:hidden' : ''}`}>
                {theme === 'dark' ? "الوضع الفاتح" : "الوضع الداكن"}
              </span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}