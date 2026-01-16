import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Tipo {
  id: number;
  name: string;
  name_eu: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  password?: string;
  nombre: string;
  apellidos: string;
  dni?: string;
  direccion?: string;
  telefono1?: string;
  telefono2?: string;
  tipo_id: number;
  tipo?: Tipo;
  argazkia_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  // Login de usuario
  login(username: string, password: string): Observable<User | undefined> {
    return this.http.post<User>(`${this.apiUrl}/login`, { username, password }).pipe(
      catchError((error) => {
        console.error('Error en login:', error);
        return of(undefined);
      })
    );
  }

  // Obtener todos los usuarios
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener usuarios:', error);
        return of([]);
      })
    );
  }

  // Obtener usuario por ID
  getUserById(id: number): Observable<User | undefined> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener usuario:', error);
        return of(undefined);
      })
    );
  }

  // Obtener usuarios por tipo (1=god, 2=admin, 3=profesor, 4=alumno)
  getUsersByTipo(tipoId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/role/${tipoId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener usuarios por tipo:', error);
        return of([]);
      })
    );
  }

  // Buscar usuarios
  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search/${query}`).pipe(
      catchError((error) => {
        console.error('Error al buscar usuarios:', error);
        return of([]);
      })
    );
  }

  // Obtener conteo de usuarios por tipo
  getUsersCount(): Observable<{ students: number; teachers: number; admins: number; total: number }> {
    return this.http.get<{ students: number; teachers: number; admins: number; total: number }>(`${this.apiUrl}/count/all`).pipe(
      catchError((error) => {
        console.error('Error al obtener conteo:', error);
        return of({ students: 0, teachers: 0, admins: 0, total: 0 });
      })
    );
  }

  // Obtener tipos de usuario
  getTipos(): Observable<Tipo[]> {
    return this.http.get<Tipo[]>(`${this.apiUrl}/tipos/all`).pipe(
      catchError((error) => {
        console.error('Error al obtener tipos:', error);
        return of([]);
      })
    );
  }

  // Eliminar usuario
  deleteUser(id: number): Observable<boolean> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error al eliminar usuario:', error);
        return of(false);
      })
    );
  }

  // Crear usuario
  createUser(user: Partial<User>): Observable<User | undefined> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      catchError((error) => {
        console.error('Error al crear usuario:', error);
        return of(undefined);
      })
    );
  }

  // Actualizar usuario
  updateUser(id: number, userData: Partial<User>): Observable<User | undefined> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, userData).pipe(
      catchError((error) => {
        console.error('Error al actualizar usuario:', error);
        return of(undefined);
      })
    );
  }

  // Obtener URL de la foto del usuario
  getUserPhotoUrl(username: string): string {
    return `${environment.apiUrl.replace('/api', '')}/public/${username}.jpg`;
  }

  // Helper para obtener el nombre del rol en español
  getRoleName(tipoId: number): string {
    switch (tipoId) {
      case 1: return 'God';
      case 2: return 'Admin';
      case 3: return 'Profesor';
      case 4: return 'Alumno';
      default: return 'Desconocido';
    }
  }

  // Helper para obtener el nombre del rol en euskera
  getRoleNameEus(tipoId: number): string {
    switch (tipoId) {
      case 1: return 'Jainkoa';
      case 2: return 'Administratzailea';
      case 3: return 'Irakaslea';
      case 4: return 'Ikaslea';
      default: return 'Ezezaguna';
    }
  }
}

