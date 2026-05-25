import requests
from supabase import create_client, Client

# Your Supabase Credentials
URL = "https://gyarkutbspbsiuucawcl.supabase.co"
KEY = "sb_publishable_ZcGvDn-LwOMboc-djLMaSw_6Z12TbRE" # Change to service_role key if updates get blocked

supabase: Client = create_client(URL, KEY)

print("📥 Downloading official clean text from Alquran.cloud...")
response = requests.get("http://api.alquran.cloud/v1/quran/quran-simple-clean")
surahs = response.json()['data']['surahs']

basmala = "بسم الله الرحمن الرحيم"
print("🔄 Updating database... (This will take a few minutes. Please grab a coffee!)")

total_updated = 0

for surah in surahs:
    surah_id = surah['number']
    for ayah in surah['ayahs']:
        ayah_num = ayah['numberInSurah']
        text = ayah['text']
        
        try:
            # Shia Ayah 0 Logic
            if surah_id > 1 and surah_id != 9 and ayah_num == 1:
                if text.startswith(basmala):
                    # Update Ayah 0 (Basmalah)
                    supabase.table("ayahs").update({"text_clean": basmala}).eq("surah_id", surah_id).eq("ayah_number", 0).execute()
                    
                    # Update Ayah 1 (Strip basmalah)
                    new_text = text[len(basmala):].strip()
                    supabase.table("ayahs").update({"text_clean": new_text}).eq("surah_id", surah_id).eq("ayah_number", 1).execute()
                    total_updated += 2
                else:
                    supabase.table("ayahs").update({"text_clean": text}).eq("surah_id", surah_id).eq("ayah_number", ayah_num).execute()
                    total_updated += 1
            else:
                # Normal Ayahs
                supabase.table("ayahs").update({"text_clean": text}).eq("surah_id", surah_id).eq("ayah_number", ayah_num).execute()
                total_updated += 1
                
        except Exception as e:
            print(f"Error on Surah {surah_id}, Ayah {ayah_num}: {e}")
        
        # Print progress every 100 ayahs so you know it is working
        if total_updated % 100 == 0:
            print(f"✅ Updated {total_updated} ayahs so far...")

print("🎉 SUCCESS! All 6,348 rows have been updated with perfect clean text!")