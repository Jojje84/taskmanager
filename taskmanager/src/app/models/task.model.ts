export interface Task {
  id: number; // Gör id valfritt med "?"
  title: string;
  description?: string;
  status: string;
  priority: string;
  projectId: number;
  userIds: number[];
  deadline?: string; // ISO-format, ex: "2025-05-06"
  projectName?: string;
}
