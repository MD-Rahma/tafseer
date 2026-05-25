// app/surah/[id]/layout.tsx

// 🚨 Here is the force dynamic rule!
export const dynamic = 'force-dynamic';

export default function SurahLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}