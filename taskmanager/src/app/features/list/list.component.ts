import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importera FormsModule
import { CommonModule } from '@angular/common'; // För grundläggande Angular-direktiv
import { UserService } from '../../core/services/user.service';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-list',
  standalone: true,
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  imports: [CommonModule, FormsModule], // Lägg till FormsModule här
})
export class ListComponent implements OnInit {
  users: any[] = [];
  projects: any[] = [];
  tasks: any[] = [];
  selectedUser: number | null = null;
  selectedUserProjects: any[] = [];
  selectedUserTasks: any[] = [];

  constructor(
    private userService: UserService,
    private projectService: ProjectService,
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
      console.log('Users:', this.users); // Kontrollera användardata
    });

    this.projectService.getProjects().subscribe((data) => {
      this.projects = data;
      console.log('Projects:', this.projects); // Kontrollera projektdata

      this.taskService.getTasks().subscribe((taskData) => {
        this.tasks = taskData.map((task) => {
          const project = this.projects.find((p) => p.id === task.projectId);
          const user = this.users.find((u) => u.id === task.userId);
          return {
            ...task,
            projectName: project ? project.name : 'Unknown',
            userName: user ? user.name : 'Unknown',
          };
        });

        // Visa alla projekt och uppgifter som standard
        this.selectedUserProjects = [...this.projects];
        this.selectedUserTasks = [...this.tasks];

        console.log('Tasks with Project Names and User Names:', this.tasks); // Kontrollera uppdaterade uppgifter
      });
    });
  }

  onUserChange(): void {
    console.log('Selected User:', this.selectedUser); // Kontrollera värdet

    // Kontrollera om data är laddad
    if (!this.projects || !this.tasks || this.projects.length === 0 || this.tasks.length === 0) {
      console.log('Data not loaded yet');
      return;
    }

    if (this.selectedUser === null) {
      // Återställ alla projekt och uppgifter
      this.selectedUserProjects = [...this.projects]; // Kopiera alla projekt
      this.selectedUserTasks = [...this.tasks]; // Kopiera alla uppgifter
      console.log('All Projects reloaded:', this.selectedUserProjects);
      console.log('All Tasks reloaded:', this.selectedUserTasks);
    } else {
      const selectedUserId = +this.selectedUser; // Konvertera till nummer

      // Filtrera projekt baserat på användarens ID
      this.selectedUserProjects = this.projects.filter(
        (project) => project.userId === selectedUserId
      );

      // Filtrera uppgifter baserat på användarens ID och projektens ID
      this.selectedUserTasks = this.tasks.filter((task) => {
        const project = this.projects.find((p) => p.id === task.projectId);
        return (
          task.userId === selectedUserId && project?.userId === selectedUserId
        );
      });

      console.log('Filtered Projects:', this.selectedUserProjects);
      console.log('Filtered Tasks:', this.selectedUserTasks);
    }
  }

  getUserName(userId: number | null): string {
    if (userId === null) {
      return 'Unknown';
    }
    const user = this.users.find((u) => u.id === userId);
    return user ? user.name : 'Unknown';
  }
}
