export interface Task {
    id: number;
    title: string;
    status: 'active' | 'completed';
    priority: 'low' | 'medium' | 'high';
    projectId: number;
  }
  