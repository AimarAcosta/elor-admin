import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface ScheduleEntry {
  id: number;
  dia: 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES';
  hora: number;
  profe_id: number;
  modulo_nombre: string;
  aula: string;
}

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private schedule: ScheduleEntry[] = [
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
      aula: 'Irakasle Gela',
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

    {
      id: 100,
      dia: 'LUNES',
      hora: 1,
      profe_id: 99,
      modulo_nombre: 'Sist. Informaticos',
      aula: '106',
    },
    {
      id: 101,
      dia: 'LUNES',
      hora: 2,
      profe_id: 99,
      modulo_nombre: 'Sist. Informaticos',
      aula: '106',
    },
    { id: 102, dia: 'LUNES', hora: 3, profe_id: 3, modulo_nombre: 'Datu-atzipena', aula: '106' },
    { id: 103, dia: 'LUNES', hora: 4, profe_id: 3, modulo_nombre: 'Datu-atzipena', aula: '106' },
    {
      id: 104,
      dia: 'MARTES',
      hora: 1,
      profe_id: 99,
      modulo_nombre: 'Ingeles Teknikoa',
      aula: '201',
    },
    {
      id: 105,
      dia: 'MARTES',
      hora: 2,
      profe_id: 99,
      modulo_nombre: 'Ingeles Teknikoa',
      aula: '201',
    },
    { id: 106, dia: 'VIERNES', hora: 6, profe_id: 99, modulo_nombre: 'Tutoretza', aula: '106' },
  ];

  constructor() {}

  getScheduleByTeacher(teacherId: number): Observable<ScheduleEntry[]> {
    return of(this.schedule.filter((s) => s.profe_id === teacherId));
  }

  getScheduleByStudent(studentId: number): Observable<ScheduleEntry[]> {
    return of(this.schedule.filter((s) => s.id >= 100));
  }
}
