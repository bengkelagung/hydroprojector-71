
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fpdckdnrntglfxqaaifp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwZGNrZG5ybnRnbGZ4cWFhaWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5OTk3MjAsImV4cCI6MjA1NzU3NTcyMH0.2fgjrmprY6ee5mFAWQwxaB9Dm4aCmxmsVeHjoSLv4mI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Check if the label column exists in pin_configs
export const checkLabelColumnExists = async (): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('pin_configs')
      .select('label')
      .limit(1);
    
    return !error || error.code !== '42703';
  } catch (e) {
    return false;
  }
};

// Function to get all labels from the label table
export const fetchLabelsFromDatabase = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_all_labels');
      
    if (error) throw error;
    
    return data.map(label => label.name);
  } catch (error) {
    console.error('Error fetching labels from database:', error);
    return getDefaultLabels();
  }
};

// Function to get default labels
export const getDefaultLabels = (): string[] => {
  return ['pH', 'Suhu', 'Kelembaban', 'Pompa', 'Lampu', 'Level Air'];
};
