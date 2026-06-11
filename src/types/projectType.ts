export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}
export interface ProjectListProps {
  projects: Project[];
  total: number;
  currentPage: number;
  limit: number;
}
export interface MemberMetadata {
  name: string;
  email: string;
}

export interface Member {
  member_id: string;
  email: string;
  role: string;
  metadata: MemberMetadata;
}
