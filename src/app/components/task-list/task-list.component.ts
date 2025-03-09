import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

// Componentes e serviços
import { TaskService } from '../../service/task.service';
import { Task } from '../../service/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TaskItemComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = []; // Lista de tarefas
  newTask: string = ''; // Nova tarefa a ser adicionada

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.tasks = this.taskService.getTasks();
  }

  // Adiciona uma nova tarefa
  onAddTask(): void {
    if (this.newTask.trim() !== '') {
      const task: Task = {
        id: this.tasks.length + 1,
        title: this.newTask,
        completed: false,
        description: ''
      };
      this.taskService.addTask(task);
      this.tasks = this.taskService.getTasks(); 
      this.newTask = '';
    }
  }

  // Edita uma tarefa
  onEditTask(task: Task): void {
    const newTitle = prompt('Editar tarefa', task.title);
    if (newTitle !== null) {
      task.title = newTitle;
      this.taskService.editTask(task);
      this.tasks = this.taskService.getTasks();
    }
  }

  // Exclui uma tarefa
  onDeleteTask(id: number): void {
    this.taskService.deleteTask(id);
    this.tasks = this.taskService.getTasks(); 
  }
}