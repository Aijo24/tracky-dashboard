export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          firebase_uid: string | null;
          email: string;
          restaurant_name: string | null;
          restaurant_address: string | null;
          initials: string | null;
          created_at: string | null;
          last_login_at: string | null;
          updated_at: string | null;
          onboarding_completed: boolean | null;
          trial_started_at: string | null;
        };
        Insert: {
          id?: string;
          firebase_uid?: string | null;
          email: string;
          restaurant_name?: string | null;
          restaurant_address?: string | null;
          initials?: string | null;
          created_at?: string | null;
          last_login_at?: string | null;
          updated_at?: string | null;
          onboarding_completed?: boolean | null;
          trial_started_at?: string | null;
        };
        Update: {
          id?: string;
          firebase_uid?: string | null;
          email?: string;
          restaurant_name?: string | null;
          restaurant_address?: string | null;
          initials?: string | null;
          created_at?: string | null;
          last_login_at?: string | null;
          updated_at?: string | null;
          onboarding_completed?: boolean | null;
          trial_started_at?: string | null;
        };
      };
      equipment: {
        Row: {
          id: string;
          name: string;
          type: "frigo" | "congelateur";
          min_temp: number;
          max_temp: number;
          location: string;
          user_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          type: "frigo" | "congelateur";
          min_temp: number;
          max_temp: number;
          location: string;
          user_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          type?: "frigo" | "congelateur";
          min_temp?: number;
          max_temp?: number;
          location?: string;
          user_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      temperature_readings: {
        Row: {
          id: string;
          equipment_id: string;
          temperature: number;
          timestamp: string | null;
          user_id: string;
          is_within_range: boolean | null;
          notes: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          equipment_id: string;
          temperature: number;
          timestamp?: string | null;
          user_id: string;
          is_within_range?: boolean | null;
          notes?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          equipment_id?: string;
          temperature?: number;
          timestamp?: string | null;
          user_id?: string;
          is_within_range?: boolean | null;
          notes?: string | null;
          created_at?: string | null;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          lot_number: string;
          expiry_date: string;
          supplier: string;
          received_date: string;
          user_id: string;
          status: "active" | "expired" | "consumed" | null;
          barcode: string | null;
          created_at: string | null;
          updated_at: string | null;
          supplier_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          lot_number: string;
          expiry_date: string;
          supplier: string;
          received_date: string;
          user_id: string;
          status?: "active" | "expired" | "consumed" | null;
          barcode?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          supplier_id?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          lot_number?: string;
          expiry_date?: string;
          supplier?: string;
          received_date?: string;
          user_id?: string;
          status?: "active" | "expired" | "consumed" | null;
          barcode?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          supplier_id?: string | null;
        };
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          contact_name: string | null;
          phone: string | null;
          email: string | null;
          address: string | null;
          user_id: string;
          is_active: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          contact_name?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          user_id: string;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          contact_name?: string | null;
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          user_id?: string;
          is_active?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      receptions: {
        Row: {
          id: string;
          supplier: string;
          delivery_date: string;
          is_conform: boolean | null;
          notes: string | null;
          delivery_photo_uris: Json | null;
          signature: string | null;
          user_id: string;
          created_at: string | null;
          updated_at: string | null;
          supplier_id: string | null;
        };
        Insert: {
          id?: string;
          supplier: string;
          delivery_date: string;
          is_conform?: boolean | null;
          notes?: string | null;
          delivery_photo_uris?: Json | null;
          signature?: string | null;
          user_id: string;
          created_at?: string | null;
          updated_at?: string | null;
          supplier_id?: string | null;
        };
        Update: {
          id?: string;
          supplier?: string;
          delivery_date?: string;
          is_conform?: boolean | null;
          notes?: string | null;
          delivery_photo_uris?: Json | null;
          signature?: string | null;
          user_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
          supplier_id?: string | null;
        };
      };
      reception_items: {
        Row: {
          id: string;
          reception_id: string;
          product_name: string;
          quantity: number;
          temperature: number | null;
          expiry_date: string;
          lot_number: string;
          is_conform: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          reception_id: string;
          product_name: string;
          quantity: number;
          temperature?: number | null;
          expiry_date: string;
          lot_number: string;
          is_conform?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          reception_id?: string;
          product_name?: string;
          quantity?: number;
          temperature?: number | null;
          expiry_date?: string;
          lot_number?: string;
          is_conform?: boolean | null;
          created_at?: string | null;
        };
      };
      freezing_records: {
        Row: {
          id: string;
          product_id: string;
          freezing_start_date: string;
          max_freezing_duration: number;
          current_status: "frozen" | "thawed" | "expired" | null;
          user_id: string;
          notes: string | null;
          created_at: string | null;
          updated_at: string | null;
          thawed_at: string | null;
          max_thawed_duration: number | null;
        };
        Insert: {
          id?: string;
          product_id: string;
          freezing_start_date: string;
          max_freezing_duration: number;
          current_status?: "frozen" | "thawed" | "expired" | null;
          user_id: string;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          thawed_at?: string | null;
          max_thawed_duration?: number | null;
        };
        Update: {
          id?: string;
          product_id?: string;
          freezing_start_date?: string;
          max_freezing_duration?: number;
          current_status?: "frozen" | "thawed" | "expired" | null;
          user_id?: string;
          notes?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          thawed_at?: string | null;
          max_thawed_duration?: number | null;
        };
      };
      rooms: {
        Row: {
          id: string;
          name: string;
          user_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          user_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          user_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      surfaces: {
        Row: {
          id: string;
          room_id: string;
          name: string;
          cleaning_frequency: "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
          last_cleaned_date: string | null;
          description: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          room_id: string;
          name: string;
          cleaning_frequency: "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
          last_cleaned_date?: string | null;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          room_id?: string;
          name?: string;
          cleaning_frequency?: "daily" | "weekly" | "biweekly" | "monthly" | "quarterly" | "yearly";
          last_cleaned_date?: string | null;
          description?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      cleaning_tasks: {
        Row: {
          id: string;
          room_id: string;
          room_name: string;
          surface_id: string;
          surface_name: string;
          description: string;
          is_completed: boolean | null;
          completed_at: string | null;
          user_id: string;
          due_date: string;
          is_overdue: boolean | null;
          signature: string | null;
          photo_uris: Json | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          room_id: string;
          room_name: string;
          surface_id: string;
          surface_name: string;
          description: string;
          is_completed?: boolean | null;
          completed_at?: string | null;
          user_id: string;
          due_date: string;
          is_overdue?: boolean | null;
          signature?: string | null;
          photo_uris?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          room_id?: string;
          room_name?: string;
          surface_id?: string;
          surface_name?: string;
          description?: string;
          is_completed?: boolean | null;
          completed_at?: string | null;
          user_id?: string;
          due_date?: string;
          is_overdue?: boolean | null;
          signature?: string | null;
          photo_uris?: Json | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      cleaning_records: {
        Row: {
          id: string;
          room_id: string;
          room_name: string;
          user_id: string;
          restaurant_name: string;
          signature: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          room_id: string;
          room_name: string;
          user_id: string;
          restaurant_name: string;
          signature?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          room_id?: string;
          room_name?: string;
          user_id?: string;
          restaurant_name?: string;
          signature?: string | null;
          created_at?: string | null;
        };
      };
      cleaning_surface_records: {
        Row: {
          id: string;
          cleaning_record_id: string;
          surface_id: string;
          surface_name: string;
          is_cleaned: boolean | null;
          photo_uris: Json | null;
          cleaned_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          cleaning_record_id: string;
          surface_id: string;
          surface_name: string;
          is_cleaned?: boolean | null;
          photo_uris?: Json | null;
          cleaned_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          cleaning_record_id?: string;
          surface_id?: string;
          surface_name?: string;
          is_cleaned?: boolean | null;
          photo_uris?: Json | null;
          cleaned_at?: string | null;
          created_at?: string | null;
        };
      };
      cleaning_plans: {
        Row: {
          id: string;
          date: string;
          is_completed: boolean | null;
          completed_at: string | null;
          user_id: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          date: string;
          is_completed?: boolean | null;
          completed_at?: string | null;
          user_id: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          date?: string;
          is_completed?: boolean | null;
          completed_at?: string | null;
          user_id?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string | null;
          stripe_customer_id: string | null;
          stripe_subscription_id: string | null;
          plan_type: "free" | "premium";
          status: "free" | "trialing" | "active" | "canceled" | "expired" | "incomplete";
          trial_ends_at: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan_type?: "free" | "premium";
          status?: "free" | "trialing" | "active" | "canceled" | "expired" | "incomplete";
          trial_ends_at?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          stripe_customer_id?: string | null;
          stripe_subscription_id?: string | null;
          plan_type?: "free" | "premium";
          status?: "free" | "trialing" | "active" | "canceled" | "expired" | "incomplete";
          trial_ends_at?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          cancel_at_period_end?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          link: string | null;
          is_read: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          link?: string | null;
          is_read?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          message?: string;
          link?: string | null;
          is_read?: boolean | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Convenience types for common use
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Equipment = Database["public"]["Tables"]["equipment"]["Row"];
export type TemperatureReading = Database["public"]["Tables"]["temperature_readings"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Supplier = Database["public"]["Tables"]["suppliers"]["Row"];
export type Reception = Database["public"]["Tables"]["receptions"]["Row"];
export type ReceptionItem = Database["public"]["Tables"]["reception_items"]["Row"];
export type FreezingRecord = Database["public"]["Tables"]["freezing_records"]["Row"];
export type Room = Database["public"]["Tables"]["rooms"]["Row"];
export type Surface = Database["public"]["Tables"]["surfaces"]["Row"];
export type CleaningTask = Database["public"]["Tables"]["cleaning_tasks"]["Row"];
export type CleaningRecord = Database["public"]["Tables"]["cleaning_records"]["Row"];
export type CleaningSurfaceRecord = Database["public"]["Tables"]["cleaning_surface_records"]["Row"];
export type CleaningPlan = Database["public"]["Tables"]["cleaning_plans"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];

// Extended types with relations
export type TemperatureReadingWithEquipment = TemperatureReading & {
  equipment: Equipment;
};

export type ReceptionWithItems = Reception & {
  reception_items: ReceptionItem[];
};

export type FreezingRecordWithProduct = FreezingRecord & {
  products: Product;
};

export type CleaningRecordWithSurfaces = CleaningRecord & {
  cleaning_surface_records: CleaningSurfaceRecord[];
};
