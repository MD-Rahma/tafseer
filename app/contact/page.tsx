'use client';
import { MessageSquare, Send } from 'lucide-react';

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // We will hook this up to the database later!
    alert("تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا.");
  };

  return (
    <main className="max-w-4xl mx-auto p-8 md:p-12 min-h-screen">
      <header className="mb-12 text-center">
        <div className="w-16 h-16 bg-[#b4914a]/10 dark:bg-[#b4914a]/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm transition-colors">
          <MessageSquare size={32} className="text-[#b4914a]" />
        </div>
        <h1 className="text-4xl font-bold text-[#2d2d2d] dark:text-gray-100 mb-4 font-serif transition-colors">اتصل بنا</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg transition-colors">يسعدنا استقبال مقترحاتكم واستفساراتكم</p>
      </header>

      <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">الاسم الكريم</label>
              <input 
                type="text" 
                required
                placeholder="اكتب اسمك هنا..."
                className="w-full bg-[#fdfbf7] dark:bg-gray-950 border-2 border-emerald-100 dark:border-gray-800 rounded-xl py-3 px-4 text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#b4914a] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">البريد الإلكتروني</label>
              <input 
                type="email" 
                required
                placeholder="example@email.com"
                className="w-full bg-[#fdfbf7] dark:bg-gray-950 border-2 border-emerald-100 dark:border-gray-800 rounded-xl py-3 px-4 text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#b4914a] text-left transition-colors"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">نوع الرسالة</label>
            <select className="w-full bg-[#fdfbf7] dark:bg-gray-950 border-2 border-emerald-100 dark:border-gray-800 rounded-xl py-3 px-4 text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#b4914a] transition-colors">
              <option>اقتراح تطوير</option>
              <option>شكر وتقدير</option>
              <option>استفسار عام</option>
              <option>أخرى</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">نص الرسالة</label>
            <textarea 
              required
              rows={5}
              placeholder="اكتب رسالتك هنا بالتفصيل..."
              className="w-full bg-[#fdfbf7] dark:bg-gray-950 border-2 border-emerald-100 dark:border-gray-800 rounded-xl py-3 px-4 text-[#2d2d2d] dark:text-white focus:outline-none focus:border-[#b4914a] transition-colors resize-none"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="submit" 
              className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#064e3b] hover:bg-[#b4914a] text-white py-4 px-8 rounded-xl font-bold transition-colors shadow-md"
            >
              <span>إرسال الرسالة</span>
              <Send size={18} />
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}