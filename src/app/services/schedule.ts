import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ScheduleEntry {
  id: number;
  dia: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES';
  hora: number; // 1 a 6
  profe_id: number;
  modulo_nombre: string;
  aula: string;
}

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private schedule: ScheduleEntry[] = [
    // LUNES
    {
      id: 34,
      dia: 'LUNES',
      hora: 3,
      profe_id: 3,
      modulo_nombre: 'Datu-atzipena',
      aula: '106',
    },
    {
      id: 35,
      dia: 'LUNES',
      hora: 4,
      profe_id: 3,
      modulo_nombre: 'Datu-atzipena',
      aula: '106',
    },
    { id: 36, dia: 'LUNES', hora: 5, profe_id: 3, modulo_nombre: 'OPT. Mugikorrak', aula: '106' },
    { id: 37, dia: 'LUNES', hora: 6, profe_id: 3, modulo_nombre: 'OPT. Mugikorrak', aula: '106' },

    { id: 42, dia: 'MARTES', hora: 5, profe_id: 3, modulo_nombre: 'Datu-atzipena', aula: '106' },
    { id: 43, dia: 'MARTES', hora: 6, profe_id: 3, modulo_nombre: 'Datu-atzipena', aula: '106' },

    {
      id: 44,
      dia: 'MIERCOLES',
      hora: 1,
      profe_id: 3,
      modulo_nombre: 'Sist. Informatikoak',
      aula: '106',
    },
    {
      id: 45,
      dia: 'MIERCOLES',
      hora: 2,
      profe_id: 3,
      modulo_nombre: 'Sist. Informatikoak',
      aula: '106',
    },

    {
      id: 634,
      dia: 'JUEVES',
      hora: 4,
      profe_id: 3,
      modulo_nombre: 'Tutoretza',
      aula: 'Sala Profes',
    },
    {
      id: 635,
      dia: 'JUEVES',
      hora: 5,
      profe_id: 3,
      modulo_nombre: 'Zaintza',
      aula: 'Pasillo',
    },
    {
      id: 636,
      dia: 'JUEVES',
      hora: 6,
      profe_id: 3,
      modulo_nombre: 'Zaintza',
      aula: 'Pasillo',
    },
  ];

  constructor() {}

  getScheduleByTeacher(teacherId: number): Observable<ScheduleEntry[]> {
    return of(this.schedule.filter((s) => s.profe_id === teacherId));
  }
}
