import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uzplklxbldjwktgmmfgz.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6cGxrbHhibGRqd2t0Z21tZmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MzUwMTMsImV4cCI6MjA3NDMxMTAxM30.iPFK-Q-qWzUCfDoSHjUKlkas-Ae0LyxqCpcI8A7wE3E";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;
