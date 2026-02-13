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
      activity_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      badges: {
        Row: {
          created_at: string
          criteria: Json
          description: string | null
          icon_url: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          criteria?: Json
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          criteria?: Json
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      direct_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      event_attendees: {
        Row: {
          created_at: string
          event_id: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "network_events"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          question: string
        }
        Insert: {
          answer: string
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question?: string
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          role: string
          status: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "network_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      innovation_posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          id: string
          is_featured: boolean
          likes_count: number
          post_type: string
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          id?: string
          is_featured?: boolean
          likes_count?: number
          post_type?: string
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          id?: string
          is_featured?: boolean
          likes_count?: number
          post_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_events: {
        Row: {
          activities: string[] | null
          color: string | null
          created_at: string
          created_by: string
          description: string | null
          end_date: string | null
          event_type: string
          icon: string | null
          id: string
          is_public: boolean
          start_date: string
          title: string
          updated_at: string
        }
        Insert: {
          activities?: string[] | null
          color?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          end_date?: string | null
          event_type?: string
          icon?: string | null
          id?: string
          is_public?: boolean
          start_date: string
          title: string
          updated_at?: string
        }
        Update: {
          activities?: string[] | null
          color?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_date?: string | null
          event_type?: string
          icon?: string | null
          id?: string
          is_public?: boolean
          start_date?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      learning_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          module_id: string
          score: number | null
          track_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id: string
          score?: number | null
          track_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          module_id?: string
          score?: number | null
          track_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      network_events: {
        Row: {
          attendees_count: number
          cover_image_url: string | null
          created_at: string
          description: string | null
          end_time: string | null
          event_type: string
          event_url: string | null
          group_id: string | null
          id: string
          is_public: boolean
          location: string | null
          organizer_id: string
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          attendees_count?: number
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_type?: string
          event_url?: string | null
          group_id?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          organizer_id: string
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          attendees_count?: number
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_type?: string
          event_url?: string | null
          group_id?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          organizer_id?: string
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_events_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "network_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      network_groups: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          group_type: string
          id: string
          members_count: number
          name: string
          owner_id: string
          posts_count: number
          updated_at: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          group_type?: string
          id?: string
          members_count?: number
          name: string
          owner_id: string
          posts_count?: number
          updated_at?: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          group_type?: string
          id?: string
          members_count?: number
          name?: string
          owner_id?: string
          posts_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      network_post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number
          mentions: string[] | null
          parent_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number
          mentions?: string[] | null
          parent_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number
          mentions?: string[] | null
          parent_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_post_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "network_post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "network_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "network_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      network_post_engagements: {
        Row: {
          created_at: string
          engagement_type: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          engagement_type: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          engagement_type?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_post_engagements_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "network_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      network_posts: {
        Row: {
          comments_count: number
          content: string
          created_at: string
          document_urls: string[] | null
          id: string
          is_pinned: boolean
          likes_count: number
          media_urls: string[] | null
          post_type: string
          saves_count: number
          shares_count: number
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          comments_count?: number
          content: string
          created_at?: string
          document_urls?: string[] | null
          id?: string
          is_pinned?: boolean
          likes_count?: number
          media_urls?: string[] | null
          post_type?: string
          saves_count?: number
          shares_count?: number
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          comments_count?: number
          content?: string
          created_at?: string
          document_urls?: string[] | null
          id?: string
          is_pinned?: boolean
          likes_count?: number
          media_urls?: string[] | null
          post_type?: string
          saves_count?: number
          shares_count?: number
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          notification_type: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          notification_type?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          notification_type?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          certificates_issued: number
          contact_email: string
          created_at: string
          id: string
          is_active: boolean
          location: string | null
          name: string
          participants_count: number
          projects_count: number
          type: string
          updated_at: string
        }
        Insert: {
          certificates_issued?: number
          contact_email: string
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string | null
          name: string
          participants_count?: number
          projects_count?: number
          type?: string
          updated_at?: string
        }
        Update: {
          certificates_issued?: number
          contact_email?: string
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string | null
          name?: string
          participants_count?: number
          projects_count?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "innovation_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "innovation_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cover_image_url: string | null
          created_at: string | null
          education: Json | null
          email: string | null
          experience: Json | null
          github_url: string | null
          headline: string | null
          id: string
          is_visible: boolean | null
          last_active: string | null
          linkedin_url: string | null
          location: string | null
          name: string | null
          points: number | null
          profile_views: number | null
          skills: string[] | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          education?: Json | null
          email?: string | null
          experience?: Json | null
          github_url?: string | null
          headline?: string | null
          id: string
          is_visible?: boolean | null
          last_active?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          points?: number | null
          profile_views?: number | null
          skills?: string[] | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          education?: Json | null
          email?: string | null
          experience?: Json | null
          github_url?: string | null
          headline?: string | null
          id?: string
          is_visible?: boolean | null
          last_active?: string | null
          linkedin_url?: string | null
          location?: string | null
          name?: string | null
          points?: number | null
          profile_views?: number | null
          skills?: string[] | null
          website?: string | null
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
      redemptions: {
        Row: {
          created_at: string
          fulfilled_at: string | null
          id: string
          reward_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fulfilled_at?: string | null
          id?: string
          reward_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fulfilled_at?: string | null
          id?: string
          reward_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "redemptions_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      rewards: {
        Row: {
          cost_points: number
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          redeemable_external: boolean | null
          stock: number | null
        }
        Insert: {
          cost_points: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          redeemable_external?: boolean | null
          stock?: number | null
        }
        Update: {
          cost_points?: number
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          redeemable_external?: boolean | null
          stock?: number | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          admin_response: string | null
          created_at: string
          id: string
          message: string
          status: string
          subject: string
          ticket_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_response?: string | null
          created_at?: string
          id?: string
          message: string
          status?: string
          subject: string
          ticket_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_response?: string | null
          created_at?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          ticket_type?: string
          updated_at?: string
          user_id?: string
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
          ai_flagged: boolean | null
          ai_verification_notes: string | null
          ai_verification_score: number | null
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
          ai_flagged?: boolean | null
          ai_verification_notes?: string | null
          ai_verification_score?: number | null
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
          ai_flagged?: boolean | null
          ai_verification_notes?: string | null
          ai_verification_score?: number | null
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
          tier: Database["public"]["Enums"]["task_tier"]
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
          tier?: Database["public"]["Enums"]["task_tier"]
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
          tier?: Database["public"]["Enums"]["task_tier"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string | null
          earned_at: string
          id: string
          user_id: string
        }
        Insert: {
          badge_id?: string | null
          earned_at?: string
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string | null
          earned_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_connections: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
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
      video_modules: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          resource_pdf_url: string | null
          title: string
          updated_at: string
          youtube_url: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          resource_pdf_url?: string | null
          title: string
          updated_at?: string
          youtube_url: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          resource_pdf_url?: string | null
          title?: string
          updated_at?: string
          youtube_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_submission_points: {
        Args: {
          p_points: number
          p_reviewer_id: string
          p_submission_id: string
        }
        Returns: undefined
      }
      can_access_tier: {
        Args: {
          p_tier: Database["public"]["Enums"]["task_tier"]
          p_user_id: string
        }
        Returns: boolean
      }
      get_user_execution_score: { Args: { p_user_id: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      redeem_reward: {
        Args: { p_reward_id: string; p_user_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "student"
      quiz_category: "innovation" | "environment"
      quiz_difficulty: "easy" | "medium" | "hard"
      submission_status: "pending" | "approved" | "rejected"
      task_category: "recycling" | "conservation" | "water" | "community"
      task_difficulty: "easy" | "medium" | "hard"
      task_tier: "basic" | "advanced" | "company"
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
      task_tier: ["basic", "advanced", "company"],
    },
  },
} as const
