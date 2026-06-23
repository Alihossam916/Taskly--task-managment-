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
export interface ProjectEpicsListProps {
  project: Project | null;
  projectId: string;
  epics: Epic[];
  total: number;
  currentPage: number;
  limit: number;
}
export interface MemberMetadata {
  name: string;
  email: string;
  job: string;
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
export interface CreatedByTask {
  name: string;
  email: string;
  department: string | null;
  id: string;
}
export interface Task {
  id: string;
  task_id: string;
  epic_id?: string;
  project_id: string;
  title: string;
  description?: string;
  due_date?: string;
  created_at: string;
  created_by: CreatedByTask;
  assignee?: { id: string };
  status: string;
}
