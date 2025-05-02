import { Component, OnInit, signal, WritableSignal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-list',
  standalone: true,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class ListComponent implements OnInit {
  users = signal<any[]>([]); // Signal för användare
  projects = signal<any[]>([]); // Signal för projekt
  tasks = signal<any[]>([]); // Signal för uppgifter
  selectedUser = signal<number | null>(null); // Signal för vald användare
  selectedUserProjects = signal<any[]>([]); // Signal för användarens projekt
  selectedUserTasks = signal<any[]>([]); // Signal för användarens uppgifter

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    // Hämta användare, projekt och uppgifter och sätt dem till signaler
    this.userService.getUsers().subscribe((data) => {
      this.users.set(data);
    });

    this.projectService.getProjects().subscribe((data) => {
      this.projects.set(data);
    });

    this.taskService.fetchTasks().subscribe((taskData) => {
      this.tasks.set(
        taskData.map((task) => {
          const project = this.projects().find((p) => p.id === task.projectId);
          const user = this.users().find((u) => u.id === task.userId);
          return {
            ...task,
            projectName: project ? project.name : 'Unknown',
            userName: user ? user.name : 'Unknown',
          };
        })
      );
    });
  }

  // Computed signal för att hantera filtrering
  selectedUserChange = computed(() => {
    const selectedUserId = this.selectedUser();
    if (selectedUserId === null) {
      // Om ingen användare är vald, visa alla projekt och uppgifter
      this.selectedUserProjects.set(this.projects());
      this.selectedUserTasks.set(this.tasks());
    } else {
      // Filtrera projekt baserat på användarens ID
      const filteredProjects = this.projects().filter(
        (project) => project.userId === selectedUserId
      );
      this.selectedUserProjects.set(filteredProjects);

      // Filtrera uppgifter baserat på användarens ID och projektens ID
      const filteredTasks = this.tasks().filter((task) => {
        const project = this.projects().find((p) => p.id === task.projectId);
        return (
          task.userId === selectedUserId && project?.userId === selectedUserId
        );
      });
      this.selectedUserTasks.set(filteredTasks);
    }
  });

  // Funktion för att hämta användarnamn
  getUserName(userId: number | null): string {
    if (userId === null) {
      return 'Unknown';
    }
    const user = this.users().find((u) => u.id === userId);
    return user ? user.name : 'Unknown';
  }

 // Definiera onUserChange metoden
 onUserChange(): void {
  this.selectedUserChange(); // Uppdatera data när användaren ändras
}
}
