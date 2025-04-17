export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectId: number;
  userId: number;
  deadline?: string;
}
