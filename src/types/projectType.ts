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
