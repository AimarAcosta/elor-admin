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

  getReuniones(): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(this.apiUrl).pipe(
      catchError(() => of([]))
    );
  }

  getReunionById(id: number): Observable<Reunion | undefined> {
    return this.http.get<Reunion>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }

  getReunionesProfesor(profesorId: number): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(`${this.apiUrl}/profesor/${profesorId}`).pipe(
      catchError(() => of([]))
    );
  }

  getReunionesAlumno(alumnoId: number): Observable<Reunion[]> {
    return this.http.get<Reunion[]>(`${this.apiUrl}/alumno/${alumnoId}`).pipe(
      catchError(() => of([]))
    );
  }

  getTodayCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${this.apiUrl}/today/count`).pipe(
      map((res) => res.count),
      catchError(() => of(0))
    );
  }

  createReunion(reunion: Partial<Reunion>): Observable<Reunion | undefined> {
    return this.http.post<Reunion>(this.apiUrl, reunion).pipe(
      catchError(() => of(undefined))
    );
  }

  updateReunion(id: number, data: Partial<Reunion>): Observable<Reunion | undefined> {
    return this.http.put<Reunion>(`${this.apiUrl}/${id}`, data).pipe(
      catchError(() => of(undefined))
    );
  }

  deleteReunion(id: number): Observable<boolean> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

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
