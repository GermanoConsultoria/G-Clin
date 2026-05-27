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
      appointments: {
        Row: {
          category: string | null
          created_at: string
          id: string
          notes: string | null
          patient_name: string
          phone: string
          plan_id: string | null
          plan_name: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["appointment_status"]
          type: Database["public"]["Enums"]["appointment_type"]
          updated_at: string
          user_id: string
          wants_to_anticipate: boolean
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          patient_name: string
          phone: string
          plan_id?: string | null
          plan_name?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["appointment_status"]
          type?: Database["public"]["Enums"]["appointment_type"]
          updated_at?: string
          user_id: string
          wants_to_anticipate?: boolean
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          patient_name?: string
          phone?: string
          plan_id?: string | null
          plan_name?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["appointment_status"]
          type?: Database["public"]["Enums"]["appointment_type"]
          updated_at?: string
          user_id?: string
          wants_to_anticipate?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "appointments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      business_hours: {
        Row: {
          break_end: string | null
          break_start: string | null
          close_time: string
          created_at: string
          id: string
          is_open: boolean
          open_time: string
          updated_at: string
          user_id: string
          weekday: number
        }
        Insert: {
          break_end?: string | null
          break_start?: string | null
          close_time?: string
          created_at?: string
          id?: string
          is_open?: boolean
          open_time?: string
          updated_at?: string
          user_id: string
          weekday: number
        }
        Update: {
          break_end?: string | null
          break_start?: string | null
          close_time?: string
          created_at?: string
          id?: string
          is_open?: boolean
          open_time?: string
          updated_at?: string
          user_id?: string
          weekday?: number
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      chart_accounts: {
        Row: {
          code: string
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["account_kind"]
          name: string
          parent_id: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          kind: Database["public"]["Enums"]["account_kind"]
          name: string
          parent_id?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["account_kind"]
          name?: string
          parent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chart_accounts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "chart_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      payables: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string
          description: string
          due_date: string
          id: string
          notes: string | null
          paid_at: string | null
          status: Database["public"]["Enums"]["finance_status"]
          supplier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string
          description: string
          due_date: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["finance_status"]
          supplier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["finance_status"]
          supplier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payables_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      receivables: {
        Row: {
          account_id: string | null
          amount: number
          created_at: string
          description: string
          due_date: string
          id: string
          notes: string | null
          patient_name: string | null
          received_at: string | null
          service_id: string | null
          status: Database["public"]["Enums"]["finance_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_id?: string | null
          amount: number
          created_at?: string
          description: string
          due_date: string
          id?: string
          notes?: string | null
          patient_name?: string | null
          received_at?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["finance_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_id?: string | null
          amount?: number
          created_at?: string
          description?: string
          due_date?: string
          id?: string
          notes?: string | null
          patient_name?: string | null
          received_at?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["finance_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "receivables_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "chart_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receivables_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          active: boolean
          cost: number
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          name: string
          price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          cost?: number
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          name: string
          price?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          cost?: number
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          name?: string
          price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_kind: "receita" | "despesa"
      appointment_status: "agendado" | "confirmado" | "concluido" | "cancelado"
      appointment_type: "consulta" | "retorno"
      finance_status: "pendente" | "pago" | "atrasado" | "cancelado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_kind: ["receita", "despesa"],
      appointment_status: ["agendado", "confirmado", "concluido", "cancelado"],
      appointment_type: ["consulta", "retorno"],
      finance_status: ["pendente", "pago", "atrasado", "cancelado"],
    },
  },
} as const
