import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './users';

export type ReunionEstado = 'pendiente' | 'aceptada' | 'denegada' | 'conflicto';
export type ReunionEstadoEus = 'onartzeke' | 'onartuta' | 'ezeztatuta' | 'gatazka';

export interface Reunion {
  id_reunion: number;
  estado: ReunionEstado;
  estado_eus?: ReunionEstadoEus;
  profesor_id?: number;
  alumno_id?: number;
  id_centro?: string;
  titulo?: string;
  asunto?: string;
  aula?: string;
  fecha?: Date;
  created_at?: Date;
  updated_at?: Date;
  profesor?: User;
  alumno?: User;
}

@Injectable({
  providedIn: 'root',
})
export class ReunionesService {
  private apiUrl = `${environment.apiUrl}/reuniones`;

  constructor(private http: HttpClient) {}

  // Obtener todas las reuniones
  getReuniones(): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener reuniones:', error);
        return of([]);
      })
    );
  }

  // Obtener reunión por ID
  getReunionById(id: number): Observable<Reunion | undefined> {
    return this.http.get<Reunion>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener reunión:', error);
        return of(undefined);
      })
    );
  }

  // Obtener reuniones de un profesor
  getReunionesProfesor(profesorId: number): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(`${this.apiUrl}/profesor/${profesorId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener reuniones del profesor:', error);
        return of([]);
      })
    );
  }

  // Obtener reuniones de un alumno
  getReunionesAlumno(alumnoId: number): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(`${this.apiUrl}/alumno/${alumnoId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener reuniones del alumno:', error);
        return of([]);
      })
    );
  }

  // Contar reuniones de hoy
  getTodayCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/today/count`).pipe(
      map((res) => res.count),
      catchError((error) => {
        console.error('Error al contar reuniones de hoy:', error);
        return of(0);
      })
    );
  }

  // Crear reunión
  createReunion(reunion: Partial<Reunion>): Observable<Reunion | undefined> {
    return this.http.post<Reunion>(this.apiUrl, reunion).pipe(
      catchError((error) => {
        console.error('Error al crear reunión:', error);
        return of(undefined);
      })
    );
  }

  // Actualizar reunión
  updateReunion(id: number, data: Partial<Reunion>): Observable<Reunion | undefined> {
    return this.http.put<Reunion>(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error al actualizar reunión:', error);
        return of(undefined);
      })
    );
  }

  // Eliminar reunión
  deleteReunion(id: number): Observable<boolean> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error al eliminar reunión:', error);
        return of(false);
      })
    );
  }

  // Helper para traducir estado
  getEstadoEus(estado: ReunionEstado): ReunionEstadoEus {
    const map: Record<ReunionEstado, ReunionEstadoEus> = {
      pendiente: 'onartzeke',
      aceptada: 'onartuta',
      denegada: 'ezeztatuta',
      conflicto: 'gatazka',
    };
    return map[estado];
  }
}
