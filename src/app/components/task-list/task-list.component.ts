import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// Componentes e serviços
import { TaskService } from '../../service/task.service';
import { Task } from '../../service/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    TaskItemComponent,
    TaskDialogComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = []; // Lista de tarefas
  filteredTasks: Task[] = []; // Lista de tarefas filtradas
  newTaskTitle: string = ''; // Título da nova tarefa
  newTaskDescription: string = ''; // Descrição da nova tarefa
  filterStatus: string = 'all'; // Filtro de status (all, active, completed)
  searchText: string = ''; // Texto de pesquisa
  private taskSubscription?: Subscription;

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.taskSubscription = this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.applyFilter();
    });
  }

  ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }

  // Retorna o número de tarefas pendentes
  getPendingTasksCount(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  // Retorna o número de tarefas concluídas
  getCompletedTasksCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }

  // Verifica se há tarefas concluídas
  hasCompletedTasks(): boolean {
    return this.tasks.some(t => t.completed);
  }

  // Aplica filtro às tarefas
  applyFilter(): void {
    let result = [...this.tasks];

    // Filtro por status
    switch (this.filterStatus) {
      case 'active':
        result = result.filter(t => !t.completed);
        break;
      case 'completed':
        result = result.filter(t => t.completed);
        break;
    }

    // Filtro por texto de pesquisa
    if (this.searchText && this.searchText.trim()) {
      const searchLower = this.searchText.toLowerCase();
      result = result.filter(
        t => 
          t.title.toLowerCase().includes(searchLower) || 
          (t.description && t.description.toLowerCase().includes(searchLower))
      );
    }

    this.filteredTasks = result;
  }

  // Manipula o evento de arrastar e soltar
  onDrop(event: CdkDragDrop<Task[]>): void {
    if (event.previousIndex !== event.currentIndex) {
      this.taskService.reorderTasks(event.previousIndex, event.currentIndex);
      this.showSnackBar('Tarefa reordenada com sucesso!');
    }
  }

  // Adiciona uma nova tarefa
  onAddTask(): void {
    if (this.newTaskTitle.trim() !== '') {
      this.taskService.addTask({
        title: this.newTaskTitle,
        description: this.newTaskDescription
      });
      
      this.newTaskTitle = '';
      this.newTaskDescription = '';
      
      this.showSnackBar('Tarefa adicionada com sucesso!');
    }
  }

  // Edita uma tarefa usando o diálogo
  onEditTask(task: Task): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '500px',
      data: { task }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.editTask(result);
        this.showSnackBar('Tarefa atualizada com sucesso!');
      }
    });
  }

  // Exclui uma tarefa
  onDeleteTask(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      this.taskService.deleteTask(id);
      this.showSnackBar('Tarefa excluída com sucesso!');
    }
  }

  // Alterna o status de conclusão da tarefa
  onToggleTaskCompletion(id: number): void {
    this.taskService.toggleTaskCompletion(id);
  }

  // Limpa todas as tarefas concluídas
  clearCompletedTasks(): void {
    if (this.hasCompletedTasks()) {
      if (confirm('Tem certeza que deseja remover todas as tarefas concluídas?')) {
        this.taskService.clearCompletedTasks();
        this.showSnackBar('Tarefas concluídas removidas!');
      }
    }
  }

  // Exibe mensagem na tela
  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
