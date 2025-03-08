import { Component } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { Task } from '../../service/task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule], // Importe módulos necessários
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent {
  newTask: Task = { id: 0, title: '', description: '' };

  constructor(private taskService: TaskService) {}

  addTask(): void {
    this.newTask.id = Date.now(); // Gera um ID único
    this.taskService.addTask(this.newTask);
    this.newTask = { id: 0, title: '', description: '' }; // Limpa o formulário
  }
}