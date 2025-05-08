export interface Task {
  id?: number; 
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectId: number;
  creatorId: number;
  deadline?: string;
  projectName?: string;
}

