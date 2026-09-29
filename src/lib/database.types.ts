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
      ai_bruk: {
        Row: {
          antall: number
          bruker_id: string
          dato: string
          minutt_antall: number
          minutt_start: string
          vurderinger: number
        }
        Insert: {
          antall?: number
          bruker_id: string
          dato?: string
          minutt_antall?: number
          minutt_start?: string
          vurderinger?: number
        }
        Update: {
          antall?: number
          bruker_id?: string
          dato?: string
          minutt_antall?: number
          minutt_start?: string
          vurderinger?: number
        }
        Relationships: []
      }
      ai_bruk_totalt: {
        Row: {
          antall: number
          dato: string
          vurderinger: number
        }
        Insert: {
          antall?: number
          dato: string
          vurderinger?: number
        }
        Update: {
          antall?: number
          dato?: string
          vurderinger?: number
        }
        Relationships: []
      }
      betaling: {
        Row: {
          bruker_id: string
          gjelder_til: string | null
          oppdatert: string
          plan: string | null
          status: string | null
          stripe_abonnement: string | null
          stripe_kunde: string
        }
        Insert: {
          bruker_id: string
          gjelder_til?: string | null
          oppdatert?: string
          plan?: string | null
          status?: string | null
          stripe_abonnement?: string | null
          stripe_kunde: string
        }
        Update: {
          bruker_id?: string
          gjelder_til?: string | null
          oppdatert?: string
          plan?: string | null
          status?: string | null
          stripe_abonnement?: string | null
          stripe_kunde?: string
        }
        Relationships: []
      }
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
          kjerne: boolean
          sortering: number
          tema_id: string
        }
        Insert: {
          begrep: string
          forklaring: string
          id?: never
          kjerne?: boolean
          sortering: number
          tema_id: string
        }
        Update: {
          begrep?: string
          forklaring?: string
          id?: never
          kjerne?: boolean
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
          abonnement_avsluttes: boolean
          abonnement_til: string | null
          id: string
          navn: string | null
          opprettet: string
          provetid_brukt: boolean
          provetid_til: string | null
          trinn: string | null
        }
        Insert: {
          abonnement?: string
          abonnement_avsluttes?: boolean
          abonnement_til?: string | null
          id: string
          navn?: string | null
          opprettet?: string
          provetid_brukt?: boolean
          provetid_til?: string | null
          trinn?: string | null
        }
        Update: {
          abonnement?: string
          abonnement_avsluttes?: boolean
          abonnement_til?: string | null
          id?: string
          navn?: string | null
          opprettet?: string
          provetid_brukt?: boolean
          provetid_til?: string | null
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
      provetid: {
        Row: {
          abonnement_id: string
          avvist: boolean
          bruker_id: string
          epost_hash: string | null
          id: number
          kort_fingeravtrykk: string | null
          opprettet: string
        }
        Insert: {
          abonnement_id: string
          avvist?: boolean
          bruker_id: string
          epost_hash?: string | null
          id?: never
          kort_fingeravtrykk?: string | null
          opprettet?: string
        }
        Update: {
          abonnement_id?: string
          avvist?: boolean
          bruker_id?: string
          epost_hash?: string | null
          id?: never
          kort_fingeravtrykk?: string | null
          opprettet?: string
        }
        Relationships: []
      }
      quiz_sporsmal: {
        Row: {
          alternativer: string[]
          forklaring: string
          i_miniprove: boolean
          i_quiz: boolean
          kjerne: boolean
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
          kjerne?: boolean
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
          kjerne?: boolean
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
      rapporter: {
        Row: {
          bruker_id: string
          grunn: string
          id: number
          nokkel: string
          opprettet: string
          tema_id: string
          type: string
        }
        Insert: {
          bruker_id?: string
          grunn: string
          id?: never
          nokkel: string
          opprettet?: string
          tema_id: string
          type: string
        }
        Update: {
          bruker_id?: string
          grunn?: string
          id?: never
          nokkel?: string
          opprettet?: string
          tema_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "rapporter_tema_id_fkey"
            columns: ["tema_id"]
            isOneToOne: false
            referencedRelation: "temaer"
            referencedColumns: ["id"]
          },
        ]
      }
      skriveoppgaver: {
        Row: {
          fasit: string
          kjerne: boolean
          kriterier: string[]
          nokkel: string
          sortering: number
          tekst: string
          tema_id: string
        }
        Insert: {
          fasit: string
          kjerne?: boolean
          kriterier?: string[]
          nokkel: string
          sortering: number
          tekst: string
          tema_id: string
        }
        Update: {
          fasit?: string
          kjerne?: boolean
          kriterier?: string[]
          nokkel?: string
          sortering?: number
          tekst?: string
          tema_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skriveoppgaver_tema_id_fkey"
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
      ai_angre_melding: { Args: { p_bruker_id: string }; Returns: undefined }
      ai_angre_vurdering: { Args: { p_bruker_id: string }; Returns: undefined }
      ai_registrer_melding: {
        Args: {
          p_bruker_id: string
          p_dagsgrense: number
          p_global_grense: number
          p_minuttgrense: number
        }
        Returns: string
      }
      ai_registrer_vurdering: {
        Args: {
          p_bruker_id: string
          p_dagsgrense: number
          p_global_grense: number
        }
        Returns: string
      }
      har_tilgang: { Args: never; Returns: boolean }
      lagre_resultat: {
        Args: {
          p_aktivitet: string
          p_av: number
          p_resultat: number
          p_tema_id: string
        }
        Returns: undefined
      }
      provetid_epostnokkel: { Args: { p_epost: string }; Returns: string }
      provetid_registrer: {
        Args: {
          p_abonnement: string
          p_bruker: string
          p_epost: string
          p_kort: string
        }
        Returns: boolean
      }
      provetid_tilgjengelig: {
        Args: { p_bruker: string; p_epost: string }
        Returns: boolean
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
