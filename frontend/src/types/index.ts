export interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  startDate?: string;
  endDate?: string;
  status: "active" | "completed" | "archived";
  managerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  projectId: number;
  assignedTo?: number;
  createdAt: string;
  updatedAt: string;
}
