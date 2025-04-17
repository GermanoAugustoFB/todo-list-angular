import { Injectable } from '@angular/core';
import { Task } from './task.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  constructor() {
    this.loadTasksFromStorage();
  }

  private loadTasksFromStorage(): void {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
      this.tasksSubject.next([...this.tasks]);
    }
  }

  private saveTasksToStorage(): void {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(task: Omit<Task, 'id' | 'completed'>): void {
    const newTask: Task = {
      ...task,
      id: Date.now(),
      completed: false
    };
    this.tasks.push(newTask);
    this.tasksSubject.next([...this.tasks]);
    this.saveTasksToStorage();
  }

  editTask(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = { ...task };
      this.tasksSubject.next([...this.tasks]);
      this.saveTasksToStorage();
    }
  }

  deleteTask(id: number): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.tasksSubject.next([...this.tasks]);
    this.saveTasksToStorage();
  }

  toggleTaskCompletion(id: number): void {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      this.tasks[index].completed = !this.tasks[index].completed;
      this.tasksSubject.next([...this.tasks]);
      this.saveTasksToStorage();
    }
  }

  clearCompletedTasks(): void {
    this.tasks = this.tasks.filter(task => !task.completed);
    this.tasksSubject.next([...this.tasks]);
    this.saveTasksToStorage();
  }

  // Nova função para reordenar tarefas
  reorderTasks(previousIndex: number, currentIndex: number): void {
    if (previousIndex === currentIndex) return;

    const taskToMove = this.tasks[previousIndex];
    this.tasks.splice(previousIndex, 1);
    this.tasks.splice(currentIndex, 0, taskToMove);

    this.tasksSubject.next([...this.tasks]);
    this.saveTasksToStorage();
  }
}
