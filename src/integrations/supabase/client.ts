
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fpdckdnrntglfxqaaifp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwZGNrZG5ybnRnbGZ4cWFhaWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE5OTk3MjAsImV4cCI6MjA1NzU3NTcyMH0.2fgjrmprY6ee5mFAWQwxaB9Dm4aCmxmsVeHjoSLv4mI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Check if essential tables exist
export const checkTablesExist = async (): Promise<boolean> => {
  try {
    const requiredTables = ['pins', 'data_types', 'signal_types', 'modes', 'label', 'pin_configs'];
    const { data: tables, error } = await supabase.rpc('get_tables');
    
    if (error) {
      console.error('Error checking tables:', error);
      return false;
    }
    
    if (!tables || !Array.isArray(tables)) {
      return false;
    }
    
    return requiredTables.every(table => tables.includes(table));
  } catch (e) {
    console.error('Error checking tables:', e);
    return false;
  }
};

// Function to get all pins with their info
export const fetchPinsWithInfo = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_pins_with_info');
      
    if (error) {
      console.error('Error fetching pins with info:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching pins with info:', error);
    return [];
  }
};

// Function to get all data types
export const fetchDataTypes = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_data_types');
      
    if (error) {
      console.error('Error fetching data types:', error);
      return [];
    }
    
    return data?.map(item => item.name) || [];
  } catch (error) {
    console.error('Error fetching data types:', error);
    return [];
  }
};

// Function to get all signal types
export const fetchSignalTypes = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_signal_types');
      
    if (error) {
      console.error('Error fetching signal types:', error);
      return [];
    }
    
    return data?.map(item => item.name) || [];
  } catch (error) {
    console.error('Error fetching signal types:', error);
    return [];
  }
};

// Function to get all modes
export const fetchModes = async (): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_modes');
      
    if (error) {
      console.error('Error fetching modes:', error);
      return [];
    }
    
    return data?.map(item => item.type) || [];
  } catch (error) {
    console.error('Error fetching modes:', error);
    return [];
  }
};

// Function to get all labels
export const fetchLabelsFromDatabase = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_labels');
      
    if (error) {
      console.error('Error fetching labels from database:', error);
      return getDefaultLabels();
    }
    
    return data?.map(item => item.name) || getDefaultLabels();
  } catch (error) {
    console.error('Error fetching labels from database:', error);
    return getDefaultLabels();
  }
};

// Function to get default labels
export const getDefaultLabels = (): string[] => {
  return ['pH', 'Suhu', 'Kelembaban', 'Pompa', 'Lampu', 'Level Air'];
};

// Function to fetch pin configs with all relations
export const fetchPinConfigsWithRelations = async (userId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .rpc('get_pin_configs_with_relations', { user_uuid: userId });
      
    if (error) {
      console.error('Error fetching pin configs with relations:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching pin configs with relations:', error);
    return [];
  }
};

// Function to find data type ID by name
export const findDataTypeIdByName = async (name: string): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('data_types')
      .select('id')
      .eq('name', name)
      .single();
      
    if (error || !data) {
      console.error('Error finding data type ID:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error finding data type ID:', error);
    return null;
  }
};

// Function to find signal type ID by name
export const findSignalTypeIdByName = async (name: string): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('signal_types')
      .select('id')
      .eq('name', name)
      .single();
      
    if (error || !data) {
      console.error('Error finding signal type ID:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error finding signal type ID:', error);
    return null;
  }
};

// Function to find mode ID by type
export const findModeIdByType = async (type: string): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('modes')
      .select('id')
      .eq('type', type)
      .single();
      
    if (error || !data) {
      console.error('Error finding mode ID:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error finding mode ID:', error);
    return null;
  }
};

// Function to find label ID by name
export const findLabelIdByName = async (name: string): Promise<number | null> => {
  if (!name) return null;
  
  try {
    const { data, error } = await supabase
      .from('label')
      .select('id')
      .eq('name', name)
      .single();
      
    if (error || !data) {
      console.error('Error finding label ID:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error finding label ID:', error);
    return null;
  }
};

// Function to find pin ID by number
export const findPinIdByNumber = async (pinNumber: number): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('pins')
      .select('id')
      .eq('pin_number', pinNumber)
      .single();
      
    if (error || !data) {
      console.error('Error finding pin ID:', error);
      return null;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error finding pin ID:', error);
    return null;
  }
};
