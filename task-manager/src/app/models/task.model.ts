// src/app/models/task.model.ts
export interface Task {
  id: number;        // Identifierare för uppgiften
  todo: string;      // Uppgiftens titel (här använder vi 'todo' istället för 'title')
  completed: boolean; // Om uppgiften är slutförd eller inte
  userId?: number;   // (Valfri) Om du vill hantera användarens ID
}
