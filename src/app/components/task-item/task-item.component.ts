import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../service/task.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule], // Importe módulos necessários
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.css'],
})
export class TaskItemComponent {
  @Input() task!: Task; // Recebe a tarefa individual
  @Output() deleteTask = new EventEmitter<number>(); // Emite o ID da tarefa para exclusão

  onDelete(): void {
    this.deleteTask.emit(this.task.id); // Emite o ID da tarefa
  }
}