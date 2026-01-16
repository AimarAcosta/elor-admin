import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './users';

export type WeekDay = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES';

export interface Modulo {
  id: number;
  nombre: string;
  nombre_eus?: string;
  horas: number;
  ciclo_id: number;
  curso: number;
}

export interface Ciclo {
  id: number;
  nombre: string;
}

export interface Horario {
  id: number;
  dia: WeekDay;
  hora: number;
  profe_id: number;
  modulo_id: number;
  aula?: string;
  observaciones?: string;
  created_at?: Date;
  updated_at?: Date;
  profesor?: User;
  modulo?: Modulo;
}

@Injectable({
  providedIn: 'root',
})
export class HorariosService {
  private apiUrl = `${environment.apiUrl}/horarios`;
  private modulosUrl = `${environment.apiUrl}/modulos`;
  private ciclosUrl = `${environment.apiUrl}/ciclos`;

  constructor(private http: HttpClient) {}

  // Obtener todos los horarios
  getHorarios(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener horarios:', error);
        return of([]);
      })
    );
  }

  // Obtener horario por ID
  getHorarioById(id: number): Observable<Horario | undefined> {
    return this.http.get<Horario>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener horario:', error);
        return of(undefined);
      })
    );
  }

  // Obtener horario de un profesor
  getHorarioProfesor(profesorId: number): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/profesor/${profesorId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener horario del profesor:', error);
        return of([]);
      })
    );
  }

  // Obtener horario de un aula
  getHorarioAula(aula: string): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/aula/${aula}`).pipe(
      catchError((error) => {
        console.error('Error al obtener horario del aula:', error);
        return of([]);
      })
    );
  }

  // Obtener horarios de un ciclo
  getHorarioCiclo(cicloId: number): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/ciclo/${cicloId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener horarios del ciclo:', error);
        return of([]);
      })
    );
  }

  // Crear horario
  createHorario(horario: Partial<Horario>): Observable<Horario | undefined> {
    return this.http.post<Horario>(this.apiUrl, horario).pipe(
      catchError((error) => {
        console.error('Error al crear horario:', error);
        return of(undefined);
      })
    );
  }

  // Actualizar horario
  updateHorario(id: number, data: Partial<Horario>): Observable<Horario | undefined> {
    return this.http.put<Horario>(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error al actualizar horario:', error);
        return of(undefined);
      })
    );
  }

  // Eliminar horario
  deleteHorario(id: number): Observable<boolean> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error al eliminar horario:', error);
        return of(false);
      })
    );
  }

  // Obtener todos los módulos
  getModulos(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.modulosUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener módulos:', error);
        return of([]);
      })
    );
  }

  // Obtener módulo por ID
  getModuloById(id: number): Observable<Modulo | undefined> {
    return this.http.get<Modulo>(`${this.modulosUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener módulo:', error);
        return of(undefined);
      })
    );
  }

  // Obtener módulos por ciclo
  getModulosByCiclo(cicloId: number): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(`${this.modulosUrl}/ciclo/${cicloId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener módulos del ciclo:', error);
        return of([]);
      })
    );
  }

  // Obtener todos los ciclos
  getCiclos(): Observable<Ciclo[]> {
    return this.http.get<Ciclo[]>(this.ciclosUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener ciclos:', error);
        return of([]);
      })
    );
  }

  // Obtener ciclo por ID
  getCicloById(id: number): Observable<Ciclo | undefined> {
    return this.http.get<Ciclo>(`${this.ciclosUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener ciclo:', error);
        return of(undefined);
      })
    );
  }

  // Helper: Traducir día a euskera
  getDiaEus(dia: WeekDay): string {
    const map: Record<WeekDay, string> = {
      'LUNES': 'ASTELEHENA',
      'MARTES': 'ASTEARTEA',
      'MIERCOLES': 'ASTEAZKENA',
      'JUEVES': 'OSTEGUNA',
      'VIERNES': 'OSTIRALA'
    };
    return map[dia];
  }
}
