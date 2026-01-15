import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  username: string;
  password: string;
  role: 'god' | 'admin' | 'teacher' | 'student';
  name: string;
  photo?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users: User[] = [
    { username: 'god', password: 'god', role: 'god', name: 'Super Admin', photo: 'unknown.jpg' },
    { username: 'admin', password: '123', role: 'admin', name: 'Idazkaria 1', photo: 'pepito.jpg' },
    { username: 'prof', password: '123', role: 'teacher', name: 'Irakasle 1', photo: 'prof1.jpg' },
    { username: 'alum', password: '123', role: 'student', name: 'Ikasle 1', photo: 'alum1.jpg' },
  ];

  constructor() {}

  login(username: string, password: string): Observable<User | undefined> {
    const user = this.users.find((u) => u.username === username && u.password === password);
    return of(user);
  }

  getUsers(): User[] {
    return this.users;
  }
}
