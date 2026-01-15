import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface User {
  id: number;
  username: string;
  password: string;
  nombre: string;
  apellidos: string;
  role: 'god' | 'admin' | 'teacher' | 'student';
  email: string;
  photo?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      username: 'goduser',
      password: '123456',
      nombre: 'God',
      apellidos: 'Admin',
      email: 'god@elorrieta.com',
      role: 'god',
    },
    {
      id: 2,
      username: 'adminuser',
      password: '123456',
      nombre: 'Admin',
      apellidos: 'User',
      email: 'admin@elorrieta.com',
      role: 'admin',
    },
    {
      id: 3,
      username: 'profesor1',
      password: '123456',
      nombre: 'Roman',
      apellidos: 'Lopez',
      email: 'prof1@elorrieta.com',
      role: 'teacher',
    },
    {
      id: 7,
      username: 'alumno1',
      password: '123456',
      nombre: 'Oscar',
      apellidos: 'Lopez',
      email: 'alum1@elorrieta.com',
      role: 'student',
    },
  ];

  constructor() {}

  login(username: string, password: string): Observable<User | undefined> {
    const user = this.users.find((u) => u.username === username && u.password === password);
    return of(user);
  }

  getUsers(): User[] {
    return this.users;
  }

  deleteUser(id: number): boolean {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) return false;

    const user = this.users[userIndex];

    if (user.role === 'god' || user.role === 'admin') {
      console.warn('No puedes borrar a un administrador o dios.');
      console.warn('Ezin duzu administratzaile edo god bat ezabatu.');
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  createUser(user: User): void {
    const newId = Math.max(...this.users.map(u => u.id)) + 1;
    user.id = newId;
    
    if (!user.photo) {
      user.photo = 'unknown.jpg'; 
    }
    
    this.users.push(user);
  }

  updateUser(updatedUser: User): boolean {
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = updatedUser;
      return true;
    }
    return false;
  }
}

