export interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectId: number;
  userId: number;
  userIds: number[];
  deadline?: string; // ISO-format, ex: "2025-05-06"
  projectName?: string;
}
