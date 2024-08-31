import { createClient, SupabaseClient } from '@supabase/supabase-js';

const URL: string = 'https://kramguncojvmbkwyhvow.supabase.co';
const API_KEY: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyYW1ndW5jb2p2bWJrd3lodm93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ5OTAxMTQsImV4cCI6MjA0MDU2NjExNH0.MlqO5CvPF4CVulcYCxOM-z7mfjSVqJbcdLCinybf7qY';

export const supabase: SupabaseClient = createClient(URL, API_KEY);
