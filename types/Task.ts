
export interface Task {
  id: string;
  title: string;
  description?: string;
  isAssigned: boolean;
  assignedTo?: string;
  createdAt: Date;
}

export interface TaskList {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
  createdAt: Date;
  organizerEmail?: string;
}
