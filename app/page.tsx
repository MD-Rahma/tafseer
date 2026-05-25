import { createClient } from '@/utils/supabase/server';
import HomeDashboard from '@/components/HomeDashboard';

export default async function Home() {
  const supabase = await createClient();

  // Fetch the Surahs from your database
  const { data: surahs } = await supabase
    .from('surahs')
    .select('*')
    .order('id', { ascending: true });

  // Pass the data to our interactive client dashboard
  return <HomeDashboard surahs={surahs || []} />;
}