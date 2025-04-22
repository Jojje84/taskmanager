import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  addUser(user: User): Observable<User> {
    const newUser: User = {
      id: 0, // Json-server auto-genererar ett nytt id
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      progress: user.progress || 0,
      completed: user.completed || 0,
      opened: user.opened || 0,
      overdue: user.overdue || 0,
    };
    return this.http.post<User>(this.baseUrl, newUser);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${user.id}`, user);
  }
}
