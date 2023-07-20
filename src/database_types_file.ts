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
      clients: {
        Row: {
          address_1: string | null
          address_2: string | null
          address_county: string | null
          address_postcode: string | null
          address_town: string | null
          baby_food: string | null
          delivery_instructions: string | null
          dietary_requirements: string[] | null
          extra_information: string | null
          family_id: string
          feminine_products: string | null
          full_name: string
          other_items: string | null
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
          dietary_requirements?: string[] | null
          extra_information?: string | null
          family_id?: string
          feminine_products?: string | null
          full_name: string
          other_items?: string | null
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
          dietary_requirements?: string[] | null
          extra_information?: string | null
          family_id?: string
          feminine_products?: string | null
          full_name?: string
          other_items?: string | null
          pet_food?: string | null
          phone_number?: string | null
          primary_key?: string
        }
        Relationships: []
      }
      families: {
        Row: {
          family_id: string
          person_type: Database["public"]["Enums"]["gender"]
          primary_key: string
          quantity: number
        }
        Insert: {
          family_id: string
          person_type: Database["public"]["Enums"]["gender"]
          primary_key?: string
          quantity: number
        }
        Update: {
          family_id?: string
          person_type?: Database["public"]["Enums"]["gender"]
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
      lists: {
        Row: {
          "1_notes": string | null
          "1_quantity": string
          "10_notes": string | null
          "10_quantity": string
          "2_notes": string | null
          "2_quantity": string
          "3_notes": string | null
          "3_quantity": string
          "4_notes": string | null
          "4_quantity": string
          "5_notes": string | null
          "5_quantity": string
          "6_notes": string | null
          "6_quantity": string
          "7_notes": string | null
          "7_quantity": string
          "8_notes": string | null
          "8_quantity": string
          "9_notes": string | null
          "9_quantity": string
          item_name: string
          primary_key: string
        }
        Insert: {
          "1_notes"?: string | null
          "1_quantity": string
          "10_notes"?: string | null
          "10_quantity": string
          "2_notes"?: string | null
          "2_quantity": string
          "3_notes"?: string | null
          "3_quantity": string
          "4_notes"?: string | null
          "4_quantity": string
          "5_notes"?: string | null
          "5_quantity": string
          "6_notes"?: string | null
          "6_quantity": string
          "7_notes"?: string | null
          "7_quantity": string
          "8_notes"?: string | null
          "8_quantity": string
          "9_notes"?: string | null
          "9_quantity": string
          item_name: string
          primary_key?: string
        }
        Update: {
          "1_notes"?: string | null
          "1_quantity"?: string
          "10_notes"?: string | null
          "10_quantity"?: string
          "2_notes"?: string | null
          "2_quantity"?: string
          "3_notes"?: string | null
          "3_quantity"?: string
          "4_notes"?: string | null
          "4_quantity"?: string
          "5_notes"?: string | null
          "5_quantity"?: string
          "6_notes"?: string | null
          "6_quantity"?: string
          "7_notes"?: string | null
          "7_quantity"?: string
          "8_notes"?: string | null
          "8_quantity"?: string
          "9_notes"?: string | null
          "9_quantity"?: string
          item_name?: string
          primary_key?: string
        }
        Relationships: []
      }
      parcels: {
        Row: {
          client_id: string
          collection_centre: string | null
          collection_datetime: string | null
          packing_datetime: string | null
          primary_key: string
          voucher_number: string | null
        }
        Insert: {
          client_id: string
          collection_centre?: string | null
          collection_datetime?: string | null
          packing_datetime?: string | null
          primary_key?: string
          voucher_number?: string | null
        }
        Update: {
          client_id?: string
          collection_centre?: string | null
          collection_datetime?: string | null
          packing_datetime?: string | null
          primary_key?: string
          voucher_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parcels_client_id_fkey"
            columns: ["client_id"]
            referencedRelation: "clients"
            referencedColumns: ["primary_key"]
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
      gender: "male" | "female" | "adult" | "boy" | "girl" | "child"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
