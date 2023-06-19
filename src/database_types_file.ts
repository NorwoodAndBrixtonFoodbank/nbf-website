export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          address_1: string | null
          address_2: string | null
          address_county: string | null
          address_postcode: string | null
          address_town: string | null
          baby_food: string | null
          delivery_instructions: string | null
          dietary_requirements: string | null
          family_id: string
          feminine_products: string | null
          full_name: string
          other_requirements: string | null
          pet_food: string | null
          phone_number: string | null
          primary_key: string
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          address_county?: string | null
          address_postcode?: string | null
          address_town?: string | null
          baby_food?: string | null
          delivery_instructions?: string | null
          dietary_requirements?: string | null
          family_id?: string
          feminine_products?: string | null
          full_name: string
          other_requirements?: string | null
          pet_food?: string | null
          phone_number?: string | null
          primary_key?: string
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          address_county?: string | null
          address_postcode?: string | null
          address_town?: string | null
          baby_food?: string | null
          delivery_instructions?: string | null
          dietary_requirements?: string | null
          family_id?: string
          feminine_products?: string | null
          full_name?: string
          other_requirements?: string | null
          pet_food?: string | null
          phone_number?: string | null
          primary_key?: string
        }
        Relationships: []
      }
      families: {
        Row: {
          family_id: string
          person_type: string
          primary_key: string
          quantity: number
        }
        Insert: {
          family_id: string
          person_type: string
          primary_key?: string
          quantity: number
        }
        Update: {
          family_id?: string
          person_type?: string
          primary_key?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "families_family_id_fkey"
            columns: ["family_id"]
            referencedRelation: "clients"
            referencedColumns: ["family_id"]
          }
        ]
      }
      parcels: {
        Row: {
          collection_centre: string | null
          collection_datetime: string | null
          family_id: string
          packing_datetime: string | null
          primary_key: string
        }
        Insert: {
          collection_centre?: string | null
          collection_datetime?: string | null
          family_id: string
          packing_datetime?: string | null
          primary_key?: string
        }
        Update: {
          collection_centre?: string | null
          collection_datetime?: string | null
          family_id?: string
          packing_datetime?: string | null
          primary_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "parcels_family_id_fkey"
            columns: ["family_id"]
            referencedRelation: "clients"
            referencedColumns: ["family_id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
