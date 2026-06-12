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
  user_id: string;
  email: string;
  role: string;
  metadata: MemberMetadata;
}

export interface UserRef {
  sub: string;
  name: string;
  email: string;
  department: string;
}

export interface Epic {
  id: string;
  epic_id: string;
  title: string;
  description?: string;
  deadline?: string;
  created_at: string;
  created_by: UserRef;
  assignee?: UserRef;
}
