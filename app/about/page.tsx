import { Info, Target, Library, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="max-w-4xl mx-auto p-8 md:p-12 min-h-screen">
      <header className="mb-12 text-center">
        <div className="w-16 h-16 bg-[#b4914a]/10 dark:bg-[#b4914a]/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm transition-colors">
          <Info size={32} className="text-[#b4914a]" />
        </div>
        <h1 className="text-4xl font-bold text-[#2d2d2d] dark:text-gray-100 mb-4 font-serif transition-colors">عن المشروع</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg transition-colors">المكتبة الرقمية الشاملة لتفاسير الشيعة الإمامية</p>
      </header>

      <div className="space-y-8">
        {/* Section 1: The Project Vision */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="flex items-center gap-3 mb-4 text-[#064e3b] dark:text-[#b4914a]">
            <Target size={24} />
            <h2 className="text-2xl font-bold font-serif">الرؤية والهدف</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-justify">
            تهدف هذه المنصة إلى جمع وتوثيق أهم التفاسير الشيعية المعتمدة للقرآن الكريم في مكان واحد، وتقديمها من خلال واجهة رقمية حديثة، سريعة، وسهلة الاستخدام. نحن نسعى لتسهيل الوصول إلى المعارف القرآنية، وتقريبها للباحثين والقراء عبر محرك بحث متقدم وتجربة قراءة عصرية خالية من المشتتات.
          </p>
        </div>

        {/* Section 2: The Tafseer Encyclopedia */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <div className="flex items-center gap-3 mb-4 text-[#064e3b] dark:text-[#b4914a]">
            <Library size={24} />
            <h2 className="text-2xl font-bold font-serif">الموسوعة التفسيرية</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed text-justify mb-8">
            لا تقتصر المنصة على كتاب واحد، بل تطمح لتكون مرجعاً شاملاً يجمع بين مختلف المدارس التفسيرية الشيعية (الروائية، العقلية، والمعاصرة)، لتوفير رؤية عميقة ومتعددة الأبعاد للنص القرآني. من أبرز التفاسير التي تضمها المنصة:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tafseer 1 */}
            <div className="bg-[#f9f7f2] dark:bg-gray-800/50 p-5 rounded-xl border-r-4 border-[#b4914a] transition-colors">
              <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#b4914a] mb-2">
                <BookOpen size={18} />
                <span className="font-bold text-lg font-serif">تفسير الميزان</span>
              </div>
              <p className="text-[#b4914a] text-xs font-bold mb-2">العلامة الطباطبائي</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                الموسوعة الكبرى التي تميزت بمنهج "تفسير القرآن بالقرآن" والتحليلات الفلسفية والاجتماعية العميقة.
              </p>
            </div>

            {/* Tafseer 2 */}
            <div className="bg-[#f9f7f2] dark:bg-gray-800/50 p-5 rounded-xl border-r-4 border-[#b4914a] transition-colors">
              <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#b4914a] mb-2">
                <BookOpen size={18} />
                <span className="font-bold text-lg font-serif">مجمع البيان</span>
              </div>
              <p className="text-[#b4914a] text-xs font-bold mb-2">الشيخ الطبرسي</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                المرجع الشامل في علوم القرآن، يتميز بدقة البحث في اللغة، الإعراب، القراءات، وأسباب النزول.
              </p>
            </div>

            {/* Tafseer 3 */}
            <div className="bg-[#f9f7f2] dark:bg-gray-800/50 p-5 rounded-xl border-r-4 border-[#b4914a] transition-colors">
              <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#b4914a] mb-2">
                <BookOpen size={18} />
                <span className="font-bold text-lg font-serif">تفسير الأمثل</span>
              </div>
              <p className="text-[#b4914a] text-xs font-bold mb-2">الشيخ ناصر مكارم الشيرازي</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                تفسير معاصر صُيغ بأسلوب حديث ومبسط، يركز على استخلاص العبر والدروس العملية لحياة الإنسان اليوم.
              </p>
            </div>

            {/* Tafseer 4 */}
            <div className="bg-[#f9f7f2] dark:bg-gray-800/50 p-5 rounded-xl border-r-4 border-[#b4914a] transition-colors">
              <div className="flex items-center gap-2 text-[#064e3b] dark:text-[#b4914a] mb-2">
                <BookOpen size={18} />
                <span className="font-bold text-lg font-serif">تفسير الصافي</span>
              </div>
              <p className="text-[#b4914a] text-xs font-bold mb-2">الفيض الكاشاني</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                من أهم التفاسير الروائية (المأثورة) التي تعتمد بشكل أساسي على تبيان الآيات من خلال أحاديث وروايات أهل البيت (ع).
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}