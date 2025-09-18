
import { useState, useEffect } from 'react';
import { Task, TaskList } from '../types/Task';

export const useTasks = () => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [currentTaskList, setCurrentTaskList] = useState<TaskList | null>(null);

  // Generate unique ID
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Create a new task list
  const createTaskList = (title: string, description?: string, organizerEmail?: string): TaskList => {
    console.log('Creating new task list:', title);
    const newTaskList: TaskList = {
      id: generateId(),
      title,
      description,
      tasks: [],
      createdAt: new Date(),
      organizerEmail,
    };
    
    setTaskLists(prev => [...prev, newTaskList]);
    setCurrentTaskList(newTaskList);
    return newTaskList;
  };

  // Add task to current list
  const addTask = (title: string, description?: string) => {
    if (!currentTaskList) {
      console.log('No current task list to add task to');
      return;
    }

    console.log('Adding task:', title);
    const newTask: Task = {
      id: generateId(),
      title,
      description,
      isAssigned: false,
      createdAt: new Date(),
    };

    const updatedTaskList = {
      ...currentTaskList,
      tasks: [...currentTaskList.tasks, newTask],
    };

    setCurrentTaskList(updatedTaskList);
    setTaskLists(prev => 
      prev.map(list => list.id === currentTaskList.id ? updatedTaskList : list)
    );
  };

  // Remove task from current list
  const removeTask = (taskId: string) => {
    if (!currentTaskList) {
      console.log('No current task list to remove task from');
      return;
    }

    console.log('Removing task:', taskId);
    const updatedTaskList = {
      ...currentTaskList,
      tasks: currentTaskList.tasks.filter(task => task.id !== taskId),
    };

    setCurrentTaskList(updatedTaskList);
    setTaskLists(prev => 
      prev.map(list => list.id === currentTaskList.id ? updatedTaskList : list)
    );
  };

  // Draw a random unassigned task
  const drawTask = (participantEmail: string): Task | null => {
    if (!currentTaskList) {
      console.log('No current task list to draw from');
      return null;
    }

    const availableTasks = currentTaskList.tasks.filter(task => !task.isAssigned);
    
    if (availableTasks.length === 0) {
      console.log('No available tasks to draw');
      return null;
    }

    const randomIndex = Math.floor(Math.random() * availableTasks.length);
    const drawnTask = availableTasks[randomIndex];
    
    console.log('Drawing task:', drawnTask.title, 'for:', participantEmail);

    // Mark task as assigned
    const updatedTask = {
      ...drawnTask,
      isAssigned: true,
      assignedTo: participantEmail,
    };

    const updatedTaskList = {
      ...currentTaskList,
      tasks: currentTaskList.tasks.map(task => 
        task.id === drawnTask.id ? updatedTask : task
      ),
    };

    setCurrentTaskList(updatedTaskList);
    setTaskLists(prev => 
      prev.map(list => list.id === currentTaskList.id ? updatedTaskList : list)
    );

    return updatedTask;
  };

  // Get available tasks count
  const getAvailableTasksCount = (): number => {
    if (!currentTaskList) return 0;
    return currentTaskList.tasks.filter(task => !task.isAssigned).length;
  };

  // Get assigned tasks count
  const getAssignedTasksCount = (): number => {
    if (!currentTaskList) return 0;
    return currentTaskList.tasks.filter(task => task.isAssigned).length;
  };

  return {
    taskLists,
    currentTaskList,
    setCurrentTaskList,
    createTaskList,
    addTask,
    removeTask,
    drawTask,
    getAvailableTasksCount,
    getAssignedTasksCount,
  };
};
