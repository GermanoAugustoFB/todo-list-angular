import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../service/task.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
})
export class TaskItemComponent {
  @Input() task!: Task; // Recebe a tarefa individual
  @Output() deleteTask = new EventEmitter<number>(); // Emite o ID da tarefa para exclusão
  @Output() editTask = new EventEmitter<Task>(); // Emite a tarefa para edição
  @Output() toggleComplete = new EventEmitter<number>(); // Emite o ID da tarefa para marcar como concluída

  onDelete(): void {
    this.deleteTask.emit(this.task.id); // Emite o ID da tarefa
  }

  onEdit(): void {
    this.editTask.emit(this.task); // Emite a tarefa para edição
  }

  onToggleComplete(): void {
    this.toggleComplete.emit(this.task.id); // Emite o ID da tarefa para marcar como concluída
  }
}
