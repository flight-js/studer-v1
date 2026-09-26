// Generert fra Supabase-skjemaet (supabase gen types). Ikke rediger for hånd –
// generer på nytt etter endringer i supabase/migrations.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      fag: {
        Row: {
          id: string
          kompetansemaal: Json
          lareplan_kode: string | null
          lareplan_url: string | null
          navn: string
          sortering: number
          trinn_id: string
        }
        Insert: {
          id: string
          kompetansemaal?: Json
          lareplan_kode?: string | null
          lareplan_url?: string | null
          navn: string
          sortering: number
          trinn_id: string
        }
        Update: {
          id?: string
          kompetansemaal?: Json
          lareplan_kode?: string | null
          lareplan_url?: string | null
          navn?: string
          sortering?: number
          trinn_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fag_trinn_id_fkey"
            columns: ["trinn_id"]
            isOneToOne: false
            referencedRelation: "trinn"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          begrep: string
          forklaring: string
          id: number
          sortering: number
          tema_id: string
        }
        Insert: {
          begrep: string
          forklaring: string
          id?: never
          sortering: number
          tema_id: string
        }
        Update: {
          begrep?: string
          forklaring?: string
          id?: never
          sortering?: number
          tema_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_tema_id_fkey"
            columns: ["tema_id"]
            isOneToOne: false
            referencedRelation: "temaer"
            referencedColumns: ["id"]
          },
        ]
      }
      fremdrift: {
        Row: {
          aktivitet: string
          av: number
          beste: number
          bruker_id: string
          sist_ovd: string
          tema_id: string
        }
        Insert: {
          aktivitet: string
          av: number
          beste: number
          bruker_id?: string
          sist_ovd?: string
          tema_id: string
        }
        Update: {
          aktivitet?: string
          av?: number
          beste?: number
          bruker_id?: string
          sist_ovd?: string
          tema_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fremdrift_tema_id_fkey"
            columns: ["tema_id"]
            isOneToOne: false
            referencedRelation: "temaer"
            referencedColumns: ["id"]
          },
        ]
      }
      miniprover: {
        Row: {
          minutter: number
          tema_id: string
        }
        Insert: {
          minutter: number
          tema_id: string
        }
        Update: {
          minutter?: number
          tema_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "miniprover_tema_id_fkey"
            columns: ["tema_id"]
            isOneToOne: true
            referencedRelation: "temaer"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          abonnement: string
          id: string
          navn: string | null
          opprettet: string
          trinn: string | null
        }
        Insert: {
          abonnement?: string
          id: string
          navn?: string | null
          opprettet?: string
          trinn?: string | null
        }
        Update: {
          abonnement?: string
          id?: string
          navn?: string | null
          opprettet?: string
          trinn?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_trinn_fkey"
            columns: ["trinn"]
            isOneToOne: false
            referencedRelation: "trinn"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sporsmal: {
        Row: {
          alternativer: string[]
          forklaring: string
          i_miniprove: boolean
          i_quiz: boolean
          nokkel: string
          riktig: number
          sortering: number
          tekst: string
          tema_id: string
          type: string
        }
        Insert: {
          alternativer: string[]
          forklaring: string
          i_miniprove: boolean
          i_quiz: boolean
          nokkel: string
          riktig: number
          sortering: number
          tekst: string
          tema_id: string
          type: string
        }
        Update: {
          alternativer?: string[]
          forklaring?: string
          i_miniprove?: boolean
          i_quiz?: boolean
          nokkel?: string
          riktig?: number
          sortering?: number
          tekst?: string
          tema_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sporsmal_tema_id_fkey"
            columns: ["tema_id"]
            isOneToOne: false
            referencedRelation: "temaer"
            referencedColumns: ["id"]
          },
        ]
      }
      tema_innhold: {
        Row: {
          sammendrag: string
          tankekart: Json
          tema_id: string
        }
        Insert: {
          sammendrag: string
          tankekart: Json
          tema_id: string
        }
        Update: {
          sammendrag?: string
          tankekart?: Json
          tema_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tema_innhold_tema_id_fkey"
            columns: ["tema_id"]
            isOneToOne: true
            referencedRelation: "temaer"
            referencedColumns: ["id"]
          },
        ]
      }
      temaer: {
        Row: {
          fag_id: string
          id: string
          intro: string
          kompetansemaal: number[]
          merknader: string[]
          navn: string
          oppdatert: string
          publisert: boolean
          slug: string
          sortering: number
          status: string
        }
        Insert: {
          fag_id: string
          id: string
          intro: string
          kompetansemaal?: number[]
          merknader?: string[]
          navn: string
          oppdatert?: string
          publisert?: boolean
          slug: string
          sortering: number
          status?: string
        }
        Update: {
          fag_id?: string
          id?: string
          intro?: string
          kompetansemaal?: number[]
          merknader?: string[]
          navn?: string
          oppdatert?: string
          publisert?: boolean
          slug?: string
          sortering?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "temaer_fag_id_fkey"
            columns: ["fag_id"]
            isOneToOne: false
            referencedRelation: "fag"
            referencedColumns: ["id"]
          },
        ]
      }
      trinn: {
        Row: {
          id: string
          navn: string
          skoleniva: string
          sortering: number
        }
        Insert: {
          id: string
          navn: string
          skoleniva: string
          sortering: number
        }
        Update: {
          id?: string
          navn?: string
          skoleniva?: string
          sortering?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      lagre_resultat: {
        Args: {
          p_aktivitet: string
          p_av: number
          p_resultat: number
          p_tema_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
