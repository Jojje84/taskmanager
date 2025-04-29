import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule], // Lägg till CommonModule här
})
export class HomeComponent {
  newsList = [
    { title: 'New Feature Released!', content: 'We have added a new feature to manage tasks more efficiently.' },
    { title: 'Maintenance Update', content: 'Scheduled maintenance will occur on May 5th, 2025.' },
    { title: 'Tips & Tricks', content: 'Learn how to use Task Manager like a pro with our new guide.' },
  ];
}
