export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      audit_log: {
        Row: {
          action: string | null
          client_id: string | null
          collection_centre_id: string | null
          content: Json | null
          event_id: string | null
          family_member_id: string | null
          list_hotel_id: string | null
          list_id: string | null
          log_id: string | null
          packing_slot_id: string | null
          parcel_id: string | null
          primary_key: string
          status_order: string | null
          user_id: string
          wasSuccess: boolean
          website_data: string | null
        }
        Insert: {
          action?: string | null
          client_id?: string | null
          collection_centre_id?: string | null
          content?: Json | null
          event_id?: string | null
          family_member_id?: string | null
          list_hotel_id?: string | null
          list_id?: string | null
          log_id?: string | null
          packing_slot_id?: string | null
          parcel_id?: string | null
          primary_key?: string
          status_order?: string | null
          user_id: string
          wasSuccess: boolean
          website_data?: string | null
        }
        Update: {
          action?: string | null
          client_id?: string | null
          collection_centre_id?: string | null
          content?: Json | null
          event_id?: string | null
          family_member_id?: string | null
          list_hotel_id?: string | null
          list_id?: string | null
          log_id?: string | null
          packing_slot_id?: string | null
          parcel_id?: string | null
          primary_key?: string
          status_order?: string | null
          user_id?: string
          wasSuccess?: boolean
          website_data?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["primary_key"]
          },
          {
            foreignKeyName: "audit_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_plus"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "audit_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "parcels_plus"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "audit_log_collection_centre_id_fkey"
            columns: ["collection_centre_id"]
            isOneToOne: false
            referencedRelation: "collection_centres"
            referencedColumns: ["primary_key"]
          },
          {
            foreignKeyName: "audit_log_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["primary_key"]
          },
          {
            foreignKeyName: "audit_log_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "families"
            referencedColumns: ["primary_key"]
          },
          {
            foreignKeyName: "audit_log_list_hotel_id_fkey"
            columns: ["list_hotel_id"]
            isOneToOne: false
            referencedRelation: "lists_hotel"
            referencedColumns: ["primary_key"]
          },
          {
            foreignKeyName: "audit_log_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["primary_key"]
          },
          {
            foreignKeyName: "audit_log_packing_slot_id_fkey"
            columns: ["packing_slot_id"]
            isOneToOne: false
            referencedRelation: "packing_slots"
            referencedColumns: ["primary_key"]
          },
          {
            foreignKeyName: "audit_log_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "last_status"
            referencedColumns: ["parcel_id"]
          },
          {
            foreignKeyName: "audit_log_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["primary_key"]
          },
          {
            foreignKeyName: "audit_log_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels_plus"
            referencedColumns: ["parcel_id"]
          },
          {
            foreignKeyName: "audit_log_status_order_fkey"
            columns: ["status_order"]
            isOneToOne: false
            referencedRelation: "status_order"
            referencedColumns: ["event_name"]
          },
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_website_data_fkey"
            columns: ["website_data"]
            isOneToOne: false
            referencedRelation: "website_data"
            referencedColumns: ["name"]
          },
        ]
      }
      clients: {
        Row: {
          address_1: string
          address_2: string
          address_county: string
          address_postcode: string
          address_town: string
          baby_food: boolean | null
          delivery_instructions: string
          dietary_requirements: string[]
          extra_information: string
          family_id: string
          feminine_products: string[]
          flagged_for_attention: boolean
          full_name: string
          other_items: string[]
          pet_food: string[]
          phone_number: string
          primary_key: string
          signposting_call_required: boolean
        }
        Insert: {
          address_1?: string
          address_2?: string
          address_county?: string
          address_postcode?: string
          address_town?: string
          baby_food?: boolean | null
          delivery_instructions?: string
          dietary_requirements?: string[]
          extra_information?: string
          family_id?: string
          feminine_products?: string[]
          flagged_for_attention?: boolean
          full_name?: string
          other_items?: string[]
          pet_food?: string[]
          phone_number?: string
          primary_key?: string
          signposting_call_required?: boolean
        }
        Update: {
          address_1?: string
          address_2?: string
          address_county?: string
          address_postcode?: string
          address_town?: string
          baby_food?: boolean | null
          delivery_instructions?: string
          dietary_requirements?: string[]
          extra_information?: string
          family_id?: string
          feminine_products?: string[]
          flagged_for_attention?: boolean
          full_name?: string
          other_items?: string[]
          pet_food?: string[]
          phone_number?: string
          primary_key?: string
          signposting_call_required?: boolean
        }
        Relationships: []
      }
      collection_centres: {
        Row: {
          acronym: string
          name: string
          primary_key: string
        }
        Insert: {
          acronym?: string
          name?: string
          primary_key?: string
        }
        Update: {
          acronym?: string
          name?: string
          primary_key?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          event_data: string | null
          event_name: string
          parcel_id: string
          primary_key: string
          timestamp: string
        }
        Insert: {
          event_data?: string | null
          event_name: string
          parcel_id: string
          primary_key?: string
          timestamp?: string
        }
        Update: {
          event_data?: string | null
          event_name?: string
          parcel_id?: string
          primary_key?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "last_status"
            referencedColumns: ["parcel_id"]
          },
          {
            foreignKeyName: "events_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["primary_key"]
          },
          {
            foreignKeyName: "events_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels_plus"
            referencedColumns: ["parcel_id"]
          },
        ]
      }
      families: {
        Row: {
          age: number | null
          family_id: string
          gender: Database["public"]["Enums"]["gender"]
          primary_key: string
        }
        Insert: {
          age?: number | null
          family_id: string
          gender?: Database["public"]["Enums"]["gender"]
          primary_key?: string
        }
        Update: {
          age?: number | null
          family_id?: string
          gender?: Database["public"]["Enums"]["gender"]
          primary_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "families_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["family_id"]
          },
          {
            foreignKeyName: "families_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_count"
            referencedColumns: ["family_id"]
          },
        ]
      }
      lists: {
        Row: {
          item_name: string
          notes_for_1: string | null
          notes_for_10: string | null
          notes_for_2: string | null
          notes_for_3: string | null
          notes_for_4: string | null
          notes_for_5: string | null
          notes_for_6: string | null
          notes_for_7: string | null
          notes_for_8: string | null
          notes_for_9: string | null
          primary_key: string
          quantity_for_1: string
          quantity_for_10: string
          quantity_for_2: string
          quantity_for_3: string
          quantity_for_4: string
          quantity_for_5: string
          quantity_for_6: string
          quantity_for_7: string
          quantity_for_8: string
          quantity_for_9: string
          row_order: number
        }
        Insert: {
          item_name?: string
          notes_for_1?: string | null
          notes_for_10?: string | null
          notes_for_2?: string | null
          notes_for_3?: string | null
          notes_for_4?: string | null
          notes_for_5?: string | null
          notes_for_6?: string | null
          notes_for_7?: string | null
          notes_for_8?: string | null
          notes_for_9?: string | null
          primary_key?: string
          quantity_for_1?: string
          quantity_for_10?: string
          quantity_for_2?: string
          quantity_for_3?: string
          quantity_for_4?: string
          quantity_for_5?: string
          quantity_for_6?: string
          quantity_for_7?: string
          quantity_for_8?: string
          quantity_for_9?: string
          row_order?: number
        }
        Update: {
          item_name?: string
          notes_for_1?: string | null
          notes_for_10?: string | null
          notes_for_2?: string | null
          notes_for_3?: string | null
          notes_for_4?: string | null
          notes_for_5?: string | null
          notes_for_6?: string | null
          notes_for_7?: string | null
          notes_for_8?: string | null
          notes_for_9?: string | null
          primary_key?: string
          quantity_for_1?: string
          quantity_for_10?: string
          quantity_for_2?: string
          quantity_for_3?: string
          quantity_for_4?: string
          quantity_for_5?: string
          quantity_for_6?: string
          quantity_for_7?: string
          quantity_for_8?: string
          quantity_for_9?: string
          row_order?: number
        }
        Relationships: []
      }
      lists_hotel: {
        Row: {
          item_name: string
          notes_for_1: string | null
          notes_for_10: string | null
          notes_for_2: string | null
          notes_for_3: string | null
          notes_for_4: string | null
          notes_for_5: string | null
          notes_for_6: string | null
          notes_for_7: string | null
          notes_for_8: string | null
          notes_for_9: string | null
          primary_key: string
          quantity_for_1: string
          quantity_for_10: string
          quantity_for_2: string
          quantity_for_3: string
          quantity_for_4: string
          quantity_for_5: string
          quantity_for_6: string
          quantity_for_7: string
          quantity_for_8: string
          quantity_for_9: string
          row_order: number
        }
        Insert: {
          item_name?: string
          notes_for_1?: string | null
          notes_for_10?: string | null
          notes_for_2?: string | null
          notes_for_3?: string | null
          notes_for_4?: string | null
          notes_for_5?: string | null
          notes_for_6?: string | null
          notes_for_7?: string | null
          notes_for_8?: string | null
          notes_for_9?: string | null
          primary_key?: string
          quantity_for_1?: string
          quantity_for_10?: string
          quantity_for_2?: string
          quantity_for_3?: string
          quantity_for_4?: string
          quantity_for_5?: string
          quantity_for_6?: string
          quantity_for_7?: string
          quantity_for_8?: string
          quantity_for_9?: string
          row_order?: number
        }
        Update: {
          item_name?: string
          notes_for_1?: string | null
          notes_for_10?: string | null
          notes_for_2?: string | null
          notes_for_3?: string | null
          notes_for_4?: string | null
          notes_for_5?: string | null
          notes_for_6?: string | null
          notes_for_7?: string | null
          notes_for_8?: string | null
          notes_for_9?: string | null
          primary_key?: string
          quantity_for_1?: string
          quantity_for_10?: string
          quantity_for_2?: string
          quantity_for_3?: string
          quantity_for_4?: string
          quantity_for_5?: string
          quantity_for_6?: string
          quantity_for_7?: string
          quantity_for_8?: string
          quantity_for_9?: string
          row_order?: number
        }
        Relationships: []
      }
      packing_slots: {
        Row: {
          is_shown: boolean
          name: string
          order: number
          primary_key: string
        }
        Insert: {
          is_shown: boolean
          name: string
          order: number
          primary_key?: string
        }
        Update: {
          is_shown?: boolean
          name?: string
          order?: number
          primary_key?: string
        }
        Relationships: []
      }
      parcels: {
        Row: {
          client_id: string
          collection_centre: string | null
          collection_datetime: string | null
          packing_date: string | null
          packing_slot: string | null
          primary_key: string
          voucher_number: string | null
        }
        Insert: {
          client_id: string
          collection_centre?: string | null
          collection_datetime?: string | null
          packing_date?: string | null
          packing_slot?: string | null
          primary_key?: string
          voucher_number?: string | null
        }
        Update: {
          client_id?: string
          collection_centre?: string | null
          collection_datetime?: string | null
          packing_date?: string | null
          packing_slot?: string | null
          primary_key?: string
          voucher_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parcels_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["primary_key"]
          },
          {
            foreignKeyName: "parcels_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_plus"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "parcels_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "parcels_plus"
            referencedColumns: ["client_id"]
          },
          {
            foreignKeyName: "parcels_collection_centre_fkey"
            columns: ["collection_centre"]
            isOneToOne: false
            referencedRelation: "collection_centres"
            referencedColumns: ["primary_key"]
          },
          {
            foreignKeyName: "parcels_packing_slot_fkey"
            columns: ["packing_slot"]
            isOneToOne: false
            referencedRelation: "packing_slots"
            referencedColumns: ["primary_key"]
          },
        ]
      }
      profiles: {
        Row: {
          first_name: string | null
          last_name: string | null
          primary_key: string
          role: Database["public"]["Enums"]["role"]
          telephone_number: string | null
        }
        Insert: {
          first_name?: string | null
          last_name?: string | null
          primary_key?: string
          role: Database["public"]["Enums"]["role"]
          telephone_number?: string | null
        }
        Update: {
          first_name?: string | null
          last_name?: string | null
          primary_key?: string
          role?: Database["public"]["Enums"]["role"]
          telephone_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_primary_key_fkey"
            columns: ["primary_key"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      status_order: {
        Row: {
          event_name: string
          workflow_order: number
        }
        Insert: {
          event_name: string
          workflow_order: number
        }
        Update: {
          event_name?: string
          workflow_order?: number
        }
        Relationships: []
      }
      website_data: {
        Row: {
          name: string
          value: string
        }
        Insert: {
          name?: string
          value?: string
        }
        Update: {
          name?: string
          value?: string
        }
        Relationships: []
      }
    }
    Views: {
      clients_plus: {
        Row: {
          address_postcode: string | null
          client_id: string | null
          family_count: number | null
          full_name: string | null
          phone_number: string | null
        }
        Relationships: []
      }
      family_count: {
        Row: {
          family_count: number | null
          family_id: string | null
        }
        Relationships: []
      }
      last_status: {
        Row: {
          event_data: string | null
          event_name: string | null
          parcel_id: string | null
          timestamp: string | null
          workflow_order: number | null
        }
        Relationships: []
      }
      parcels_plus: {
        Row: {
          client_address_postcode: string | null
          client_flagged_for_attention: boolean | null
          client_full_name: string | null
          client_id: string | null
          client_phone_number: string | null
          client_signposting_call_required: boolean | null
          collection_centre_acronym: string | null
          collection_centre_name: string | null
          collection_datetime: string | null
          family_count: number | null
          last_status_event_data: string | null
          last_status_event_name: string | null
          last_status_timestamp: string | null
          last_status_workflow_order: number | null
          packing_date: string | null
          packing_slot_name: string | null
          packing_slot_order: number | null
          parcel_id: string | null
          voucher_number: string | null
        }
        Relationships: []
      }
      profiles_plus: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          last_name: string | null
          role: Database["public"]["Enums"]["role"] | null
          telephone_number: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_primary_key_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      insertClientAndTheirFamily: {
        Args: {
          clientrecord: Json
          familymembers: Json
        }
        Returns: string
      }
      packing_slot_order_swap: {
        Args: {
          id1: string
          id2: string
        }
        Returns: undefined
      }
      updateClientAndTheirFamily: {
        Args: {
          clientrecord: Json
          familymembers: Json
          clientid: string
        }
        Returns: string
      }
    }
    Enums: {
      gender: "male" | "female" | "other"
      role: "caller" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
        Database["public"]["Views"])
    ? (Database["public"]["Tables"] &
        Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never

