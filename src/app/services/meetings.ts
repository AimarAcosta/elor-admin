import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Meeting {
  id_reunion: number;
  titulo?: string;
  asunto?: string;
  fecha: Date;
  estado: 'pendiente' | 'aceptada' | 'denegada' | 'conflicto';
  profesor_id?: number;
  alumno_id?: number;
}

@Injectable({
  providedIn: 'root',
})
export class MeetingsService {
  private meetings: Meeting[] = [
    {
      id_reunion: 1,
      estado: 'pendiente',
      profesor_id: 3,
      alumno_id: 7,
      fecha: new Date('2025-01-15T10:00:00'),
      titulo: 'Reunión SQL 1',
    },
    {
      id_reunion: 2,
      estado: 'pendiente',
      profesor_id: 3,
      alumno_id: 8,
      fecha: new Date('2025-01-16T11:00:00'),
      titulo: 'Reunión SQL 2',
    },

    {
      id_reunion: 999,
      estado: 'pendiente',
      fecha: new Date(),
      titulo: 'Reunión de Prueba HOY (Para el Dashboard)',
    },
  ];

  constructor() {}

  getMeetings(): Observable<Meeting[]> {
    return of(this.meetings);
  }

  getTodayMeetingsCount(): number {
    const today = new Date();
    return this.meetings.filter(
      (m) =>
        m.fecha.getDate() === today.getDate() &&
        m.fecha.getMonth() === today.getMonth() &&
        m.fecha.getFullYear() === today.getFullYear()
    ).length;
  }
}
