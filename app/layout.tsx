import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "تفسير الميزان",
  description: "المكتبة القرآنية الشيعية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="bg-[#fdfbf7] dark:bg-gray-950 text-[#2d2d2d] dark:text-gray-200 transition-colors duration-300">
        <ThemeProvider>
          {/* ✨ RESPONSIVE FIX: flex-col on mobile, md:flex-row on desktop */}
          <div className="flex flex-col md:flex-row min-h-screen">
            
            {/* The Sidebar will now sit at the top on mobile, and side on desktop */}
            <Sidebar />
            
            {/* Using <main> instead of <div> is better for SEO and screen readers */}
            <main className="flex-1 w-full transition-all duration-300 p-4 md:p-8">
              {children}
            </main>
            
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}