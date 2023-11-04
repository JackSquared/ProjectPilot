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
      kanban_boards: {
        Row: {
          created_at: string
          id: number
          name: string
          project_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          project_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          project_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kanban_boards_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          owner_id: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          owner_id?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          owner_id?: number | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          board_id: number | null
          created_at: string
          description: string | null
          id: number
          name: string
          status: string | null
        }
        Insert: {
          board_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name: string
          status?: string | null
        }
        Update: {
          board_id?: number | null
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_board_id_fkey"
            columns: ["board_id"]
            referencedRelation: "kanban_boards"
            referencedColumns: ["id"]
          }
        ]
      }
      user_projects: {
        Row: {
          project_id: number
          user_id: string
        }
        Insert: {
          project_id: number
          user_id: string
        }
        Update: {
          project_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_projects_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_projects_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
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
