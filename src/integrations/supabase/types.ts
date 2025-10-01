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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          owner_id: string
          phone: string | null
          postal_code: string | null
          tax_number: string | null
          updated_at: string
          vat_number: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          owner_id: string
          phone?: string | null
          postal_code?: string | null
          tax_number?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          owner_id?: string
          phone?: string | null
          postal_code?: string | null
          tax_number?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Relationships: []
      }
      contact_persons: {
        Row: {
          company_id: string
          contact_type: string | null
          created_at: string
          customer_company_id: string | null
          email: string | null
          first_name: string
          id: string
          is_employee: boolean | null
          is_primary_contact: boolean | null
          is_private_customer: boolean | null
          last_name: string
          mobile: string | null
          notes: string | null
          phone: string | null
          position: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          contact_type?: string | null
          created_at?: string
          customer_company_id?: string | null
          email?: string | null
          first_name: string
          id?: string
          is_employee?: boolean | null
          is_primary_contact?: boolean | null
          is_private_customer?: boolean | null
          last_name: string
          mobile?: string | null
          notes?: string | null
          phone?: string | null
          position?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          contact_type?: string | null
          created_at?: string
          customer_company_id?: string | null
          email?: string | null
          first_name?: string
          id?: string
          is_employee?: boolean | null
          is_primary_contact?: boolean | null
          is_private_customer?: boolean | null
          last_name?: string
          mobile?: string | null
          notes?: string | null
          phone?: string | null
          position?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_persons_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_persons_customer_company_id_fkey"
            columns: ["customer_company_id"]
            isOneToOne: false
            referencedRelation: "customer_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_companies: {
        Row: {
          address: string | null
          city: string | null
          company_id: string
          company_type: string | null
          contact_type: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          industry_category: string | null
          is_customer: boolean | null
          name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          status: string | null
          updated_at: string
          vat_number: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_id: string
          company_type?: string | null
          contact_type?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry_category?: string | null
          is_customer?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          status?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_id?: string
          company_type?: string | null
          contact_type?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry_category?: string | null
          is_customer?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          status?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_children: {
        Row: {
          birth_date: string
          created_at: string | null
          employee_details_id: string
          first_name: string
          id: string
          last_name: string
        }
        Insert: {
          birth_date: string
          created_at?: string | null
          employee_details_id: string
          first_name: string
          id?: string
          last_name: string
        }
        Update: {
          birth_date?: string
          created_at?: string | null
          employee_details_id?: string
          first_name?: string
          id?: string
          last_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_children_employee_details_id_fkey"
            columns: ["employee_details_id"]
            isOneToOne: false
            referencedRelation: "employee_details"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_details: {
        Row: {
          address_since: string | null
          ahv_number: string | null
          birth_date: string | null
          birth_place: string | null
          company_id: string
          contact_person_id: string
          created_at: string | null
          current_address: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employment_start_date: string | null
          id: string
          marital_status: string | null
          origin_country: string | null
          permit_document_url: string | null
          permit_type: string | null
          tax_residence: boolean | null
          updated_at: string | null
        }
        Insert: {
          address_since?: string | null
          ahv_number?: string | null
          birth_date?: string | null
          birth_place?: string | null
          company_id: string
          contact_person_id: string
          created_at?: string | null
          current_address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employment_start_date?: string | null
          id?: string
          marital_status?: string | null
          origin_country?: string | null
          permit_document_url?: string | null
          permit_type?: string | null
          tax_residence?: boolean | null
          updated_at?: string | null
        }
        Update: {
          address_since?: string | null
          ahv_number?: string | null
          birth_date?: string | null
          birth_place?: string | null
          company_id?: string
          contact_person_id?: string
          created_at?: string | null
          current_address?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employment_start_date?: string | null
          id?: string
          marital_status?: string | null
          origin_country?: string | null
          permit_document_url?: string | null
          permit_type?: string | null
          tax_residence?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_details_contact_person_id_fkey"
            columns: ["contact_person_id"]
            isOneToOne: true
            referencedRelation: "contact_persons"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: string | null
          created_at: string
          deleted_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_status?: string | null
          created_at?: string
          deleted_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_status?: string | null
          created_at?: string
          deleted_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_roles: {
        Args: { _user_id: string }
        Returns: {
          company_name: string
          role: Database["public"]["Enums"]["app_role"]
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "masteradministrator"
        | "administrator"
        | "objektleiter"
        | "reinigungsmitarbeiter"
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
      app_role: [
        "masteradministrator",
        "administrator",
        "objektleiter",
        "reinigungsmitarbeiter",
      ],
    },
  },
} as const
