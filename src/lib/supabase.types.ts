export type Json =
  | string
  | number
  | boolean
  | null
  | {[key: string]: Json | undefined}
  | Json[];

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          client_tags: string[] | null;
          created_at: string;
          description: string | null;
          id: number;
          name: string;
          ops_tags: string[] | null;
          server_tags: string[] | null;
          storage_tags: string[] | null;
          user_id: string;
        };
        Insert: {
          client_tags?: string[] | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          name: string;
          ops_tags?: string[] | null;
          server_tags?: string[] | null;
          storage_tags?: string[] | null;
          user_id: string;
        };
        Update: {
          client_tags?: string[] | null;
          created_at?: string;
          description?: string | null;
          id?: number;
          name?: string;
          ops_tags?: string[] | null;
          server_tags?: string[] | null;
          storage_tags?: string[] | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
