import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './users';

export interface Ciclo {
  id: number;
  nombre: string;
}

export interface Matriculacion {
  id: number;
  alum_id: number;
  ciclo_id: number;
  curso: number;
  fecha: Date;
  alumno?: User;
  ciclo?: Ciclo;
}

@Injectable({
  providedIn: 'root',
})
export class MatriculacionesService {
  private apiUrl = `${environment.apiUrl}/matriculaciones`;

  constructor(private http: HttpClient) {}

  // Obtener todas las matriculaciones
  getMatriculaciones(): Observable<Matriculacion[]> {
    return this.http.get<Matriculacion[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener matriculaciones:', error);
        return of([]);
      })
    );
  }

  // Obtener matriculación por ID
  getMatriculacionById(id: number): Observable<Matriculacion | undefined> {
    return this.http.get<Matriculacion>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener matriculación:', error);
        return of(undefined);
      })
    );
  }

  // Obtener matriculaciones de un alumno
  getMatriculacionesAlumno(alumnoId: number): Observable<Matriculacion[]> {
    return this.http.get<Matriculacion[]>(`${this.apiUrl}/alumno/${alumnoId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener matriculaciones del alumno:', error);
        return of([]);
      })
    );
  }

  // Obtener matriculaciones de un ciclo
  getMatriculacionesCiclo(cicloId: number): Observable<Matriculacion[]> {
    return this.http.get<Matriculacion[]>(`${this.apiUrl}/ciclo/${cicloId}`).pipe(
      catchError((error) => {
        console.error('Error al obtener matriculaciones del ciclo:', error);
        return of([]);
      })
    );
  }

  // Crear matriculación
  createMatriculacion(matriculacion: Partial<Matriculacion>): Observable<Matriculacion | undefined> {
    return this.http.post<Matriculacion>(this.apiUrl, matriculacion).pipe(
      catchError((error) => {
        console.error('Error al crear matriculación:', error);
        return of(undefined);
      })
    );
  }

  // Eliminar matriculación
  deleteMatriculacion(id: number): Observable<boolean> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error al eliminar matriculación:', error);
        return of(false);
      })
    );
  }
}
