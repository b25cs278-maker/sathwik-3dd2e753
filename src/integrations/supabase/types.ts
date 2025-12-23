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
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          id: string
          last_active: string | null
          name: string | null
          points: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          last_active?: string | null
          name?: string | null
          points?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_active?: string | null
          name?: string | null
          points?: number | null
        }
        Relationships: []
      }
      quiz_attempts: {
        Row: {
          completed_at: string
          correct_answers: number
          id: string
          points_earned: number
          quiz_id: string
          score: number
          started_at: string
          time_taken_seconds: number
          total_questions: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          correct_answers?: number
          id?: string
          points_earned?: number
          quiz_id: string
          score?: number
          started_at?: string
          time_taken_seconds: number
          total_questions?: number
          user_id: string
        }
        Update: {
          completed_at?: string
          correct_answers?: number
          id?: string
          points_earned?: number
          quiz_id?: string
          score?: number
          started_at?: string
          time_taken_seconds?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          base_points: number
          category: Database["public"]["Enums"]["quiz_category"]
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["quiz_difficulty"]
          id: string
          is_active: boolean
          level: number
          questions: Json
          time_limit_seconds: number
          title: string
          updated_at: string
        }
        Insert: {
          base_points?: number
          category: Database["public"]["Enums"]["quiz_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["quiz_difficulty"]
          id?: string
          is_active?: boolean
          level?: number
          questions?: Json
          time_limit_seconds?: number
          title: string
          updated_at?: string
        }
        Update: {
          base_points?: number
          category?: Database["public"]["Enums"]["quiz_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["quiz_difficulty"]
          id?: string
          is_active?: boolean
          level?: number
          questions?: Json
          time_limit_seconds?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      task_evaluations: {
        Row: {
          created_at: string
          evaluated_at: string
          id: string
          improvement_points: Json
          model_used: string | null
          overall_score: number
          rubric_scores: Json
          submission_id: string | null
          summary: string | null
          task_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          evaluated_at?: string
          id?: string
          improvement_points?: Json
          model_used?: string | null
          overall_score: number
          rubric_scores?: Json
          submission_id?: string | null
          summary?: string | null
          task_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          evaluated_at?: string
          id?: string
          improvement_points?: Json
          model_used?: string | null
          overall_score?: number
          rubric_scores?: Json
          submission_id?: string | null
          summary?: string | null
          task_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_evaluations_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "task_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_evaluations_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_submissions: {
        Row: {
          created_at: string
          id: string
          location_accuracy: number | null
          location_lat: number | null
          location_lng: number | null
          metadata: Json | null
          photos: Json | null
          points_awarded: number | null
          review_notes: string | null
          reviewed_at: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["submission_status"]
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          location_accuracy?: number | null
          location_lat?: number | null
          location_lng?: number | null
          metadata?: Json | null
          photos?: Json | null
          points_awarded?: number | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          location_accuracy?: number | null
          location_lat?: number | null
          location_lng?: number | null
          metadata?: Json | null
          photos?: Json | null
          points_awarded?: number | null
          review_notes?: string | null
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["submission_status"]
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category: Database["public"]["Enums"]["task_category"]
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: Database["public"]["Enums"]["task_difficulty"]
          estimated_time: string | null
          id: string
          image_url: string | null
          instructions: Json | null
          is_active: boolean
          location_lat: number | null
          location_lng: number | null
          location_radius_m: number | null
          location_required: boolean
          points: number
          requirements: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["task_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["task_difficulty"]
          estimated_time?: string | null
          id?: string
          image_url?: string | null
          instructions?: Json | null
          is_active?: boolean
          location_lat?: number | null
          location_lng?: number | null
          location_radius_m?: number | null
          location_required?: boolean
          points?: number
          requirements?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["task_category"]
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: Database["public"]["Enums"]["task_difficulty"]
          estimated_time?: string | null
          id?: string
          image_url?: string | null
          instructions?: Json | null
          is_active?: boolean
          location_lat?: number | null
          location_lng?: number | null
          location_radius_m?: number | null
          location_required?: boolean
          points?: number
          requirements?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student"
      quiz_category: "innovation" | "environment"
      quiz_difficulty: "easy" | "medium" | "hard"
      submission_status: "pending" | "approved" | "rejected"
      task_category: "recycling" | "conservation" | "water" | "community"
      task_difficulty: "easy" | "medium" | "hard"
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
      app_role: ["admin", "student"],
      quiz_category: ["innovation", "environment"],
      quiz_difficulty: ["easy", "medium", "hard"],
      submission_status: ["pending", "approved", "rejected"],
      task_category: ["recycling", "conservation", "water", "community"],
      task_difficulty: ["easy", "medium", "hard"],
    },
  },
} as const
