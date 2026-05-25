import { createClient } from '@supabase/supabase-js';

// 1. Initialize Supabase Connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Interfaces
export interface Ayah {
  id: number;
  surah_id: number;
  ayah_number: number;
  text_uthmani: string;
  text_clean?: string;
}

export interface GroupedTafseer {
  id: number;
  surah_id: number;
  start_ayah: number;
  end_ayah: number;
  content: string;
  scholar_name: string;
  source_book: string;
}

// ==========================================
// 3. DATABASE FUNCTIONS
// ==========================================

// Function A: Fetch Surah Content (Ayahs & Grouped Tafseers)
export async function getSurahContent(surahId: string | number) {
  const numericSurahId = Number(surahId);

  const { data: ayahs, error: ayahsError } = await supabase
    .from('ayahs')
    .select('*')
    .eq('surah_id', numericSurahId)
    .order('ayah_number', { ascending: true });

  const { data: tafseersData, error: tafseersError } = await supabase
    .from('tafseers')
    .select('*')
    .eq('surah_id', numericSurahId)
    .order('ayah_id', { ascending: true });

  if (ayahsError) console.error('Error fetching ayahs:', ayahsError);
  if (tafseersError) console.error('Error fetching tafseers:', tafseersError);

  // Format & clean the data
  const formattedTafseers: GroupedTafseer[] = (tafseersData || []).map((row: any) => ({
    id: row.id || Math.random(),
    surah_id: row.surah_id,
    start_ayah: Number(row.ayah_id), 
    end_ayah: Number(row.ayah_id), 
    content: row.content,
    scholar_name: row.scholar_name,
    source_book: row.source_book.trim() // Trims hidden spaces
  }));

  return { 
    ayahs: ayahs || [], 
    tafseers: formattedTafseers 
  };
}

// Function B: Submit Issue Report
export async function submitReport(surahId: number, ayahNumber: number, issueType: string, description: string) {
  const { error } = await supabase
    .from('reports')
    .insert([{ surah_id: surahId, ayah_number: ayahNumber, issue_type: issueType, description: description }]);

  if (error) {
    console.error('Error submitting report:', error);
    return false;
  }
  return true;
}

// Function C: Advanced Search Engine
export async function searchQuranText(keyword: string): Promise<Ayah[]> {
  const cleanKeyword = keyword
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه');

  const { data, error } = await supabase
    .from('ayahs')
    .select(`id, surah_id, ayah_number, text_uthmani, surahs ( name_ar )`)
    .or(`text_clean.ilike.% ${cleanKeyword} %,text_clean.ilike.${cleanKeyword} %,text_clean.ilike.% ${cleanKeyword},text_clean.eq.${cleanKeyword}`)
    .limit(50); 

  if (error) {
    console.error('Error searching Quran:', error);
    return [];
  }
  return data || [];
}