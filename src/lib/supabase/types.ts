export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          restaurant_name: string | null
          restaurant_address: string | null
          initials: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          restaurant_name?: string | null
          restaurant_address?: string | null
          initials?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          restaurant_name?: string | null
          restaurant_address?: string | null
          initials?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      equipment: {
        Row: {
          id: string
          name: string
          type: 'frigo' | 'congelateur'
          min_temp: number
          max_temp: number
          location: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'frigo' | 'congelateur'
          min_temp: number
          max_temp: number
          location: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'frigo' | 'congelateur'
          min_temp?: number
          max_temp?: number
          location?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      temperature_readings: {
        Row: {
          id: string
          equipment_id: string
          temperature: number
          timestamp: string
          user_id: string
          is_within_range: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          equipment_id: string
          temperature: number
          timestamp?: string
          user_id: string
          is_within_range: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          equipment_id?: string
          temperature?: number
          timestamp?: string
          user_id?: string
          is_within_range?: boolean
          notes?: string | null
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          lot_number: string
          expiry_date: string
          supplier: string
          received_date: string
          user_id: string
          status: 'active' | 'expired' | 'consumed'
          barcode: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          lot_number: string
          expiry_date: string
          supplier: string
          received_date: string
          user_id: string
          status?: 'active' | 'expired' | 'consumed'
          barcode?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          lot_number?: string
          expiry_date?: string
          supplier?: string
          received_date?: string
          user_id?: string
          status?: 'active' | 'expired' | 'consumed'
          barcode?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      receptions: {
        Row: {
          id: string
          supplier: string
          delivery_date: string
          is_conform: boolean
          notes: string | null
          delivery_photo_uris: Json | null
          signature: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          supplier: string
          delivery_date: string
          is_conform: boolean
          notes?: string | null
          delivery_photo_uris?: Json | null
          signature?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier?: string
          delivery_date?: string
          is_conform?: boolean
          notes?: string | null
          delivery_photo_uris?: Json | null
          signature?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      reception_items: {
        Row: {
          id: string
          reception_id: string
          product_name: string
          quantity: number
          temperature: number | null
          expiry_date: string | null
          lot_number: string | null
          is_conform: boolean
          created_at: string
        }
        Insert: {
          id?: string
          reception_id: string
          product_name: string
          quantity: number
          temperature?: number | null
          expiry_date?: string | null
          lot_number?: string | null
          is_conform: boolean
          created_at?: string
        }
        Update: {
          id?: string
          reception_id?: string
          product_name?: string
          quantity?: number
          temperature?: number | null
          expiry_date?: string | null
          lot_number?: string | null
          is_conform?: boolean
          created_at?: string
        }
      }
      freezing_records: {
        Row: {
          id: string
          product_id: string
          freezing_start_date: string
          thawed_at: string | null
          max_freezing_duration: number
          max_thawed_duration: number
          current_status: 'frozen' | 'thawed' | 'expired'
          user_id: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          freezing_start_date: string
          thawed_at?: string | null
          max_freezing_duration: number
          max_thawed_duration?: number
          current_status?: 'frozen' | 'thawed' | 'expired'
          user_id: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          freezing_start_date?: string
          thawed_at?: string | null
          max_freezing_duration?: number
          max_thawed_duration?: number
          current_status?: 'frozen' | 'thawed' | 'expired'
          user_id?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      rooms: {
        Row: {
          id: string
          name: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      surfaces: {
        Row: {
          id: string
          room_id: string
          name: string
          cleaning_frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
          last_cleaned_date: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          name: string
          cleaning_frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
          last_cleaned_date?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          name?: string
          cleaning_frequency?: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly'
          last_cleaned_date?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      cleaning_tasks: {
        Row: {
          id: string
          room_id: string
          room_name: string
          surface_id: string
          surface_name: string
          description: string | null
          is_completed: boolean
          completed_at: string | null
          user_id: string
          due_date: string
          is_overdue: boolean
          signature: string | null
          photo_uris: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          room_id: string
          room_name: string
          surface_id: string
          surface_name: string
          description?: string | null
          is_completed?: boolean
          completed_at?: string | null
          user_id: string
          due_date: string
          is_overdue?: boolean
          signature?: string | null
          photo_uris?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          room_name?: string
          surface_id?: string
          surface_name?: string
          description?: string | null
          is_completed?: boolean
          completed_at?: string | null
          user_id?: string
          due_date?: string
          is_overdue?: boolean
          signature?: string | null
          photo_uris?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      cleaning_records: {
        Row: {
          id: string
          room_id: string
          room_name: string
          user_id: string
          restaurant_name: string | null
          signature: string | null
          created_at: string
        }
        Insert: {
          id?: string
          room_id: string
          room_name: string
          user_id: string
          restaurant_name?: string | null
          signature?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          room_id?: string
          room_name?: string
          user_id?: string
          restaurant_name?: string | null
          signature?: string | null
          created_at?: string
        }
      }
      cleaning_surface_records: {
        Row: {
          id: string
          cleaning_record_id: string
          surface_id: string
          surface_name: string
          is_cleaned: boolean
          photo_uris: Json | null
          cleaned_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          cleaning_record_id: string
          surface_id: string
          surface_name: string
          is_cleaned: boolean
          photo_uris?: Json | null
          cleaned_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          cleaning_record_id?: string
          surface_id?: string
          surface_name?: string
          is_cleaned?: boolean
          photo_uris?: Json | null
          cleaned_at?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}