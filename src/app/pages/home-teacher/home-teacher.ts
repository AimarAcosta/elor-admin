import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { HorariosService, Horario, WeekDay } from '../../services/schedule';
import { ReunionesService, Reunion } from '../../services/meetings';

@Component({
  selector: 'app-home-teacher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-teacher.html',
  styleUrls: ['./home-teacher.css'],
})
export class HomeTeacher implements OnInit {
  timeTable: any[][] = [];

  days: WeekDay[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];

  daysEus = ['ASTELEHENA', 'ASTEARTEA', 'ASTEAZKENA', 'OSTEGUNA', 'OSTIRALA'];

  hours = [1, 2, 3, 4, 5, 6];
  currentUser: any;
  myReuniones: Reunion[] = [];

  constructor(
    private authService: AuthService,
    private horariosService: HorariosService,
    private reunionesService: ReunionesService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.initializeEmptyTable();
    if (this.currentUser) {
      this.loadScheduleData(this.currentUser.id);
      this.loadReuniones(this.currentUser.id);
    }
  }

  initializeEmptyTable() {
    for (let h = 0; h < 6; h++) {
      this.timeTable[h] = [];
      for (let d = 0; d < 5; d++) {
        this.timeTable[h][d] = {
          text: '',
          subtext: '',
          type: 'free',
          colorClass: '',
        };
      }
    }
  }

  loadScheduleData(userId: number) {
    this.horariosService.getHorarioProfesor(userId).subscribe((horarios) => {
      horarios.forEach((horario) => {
        const dayIndex = this.days.indexOf(horario.dia);
        const hourIndex = horario.hora - 1;

        if (dayIndex >= 0 && hourIndex >= 0 && hourIndex < 6) {
          const moduloNombre = horario.modulo?.nombre_eus || horario.modulo?.nombre || 'Modulua';
          this.timeTable[hourIndex][dayIndex] = {
            text: moduloNombre,
            subtext: horario.aula || '',
            type: 'class',
            colorClass: 'bg-light',
          };
        }
      });
    });
  }

  loadReuniones(profesorId: number) {
    this.reunionesService.getReunionesProfesor(profesorId).subscribe((reuniones) => {
      this.myReuniones = reuniones;
      
      // Mostrar reuniones en el horario según la fecha
      reuniones.forEach((reunion) => {
        if (reunion.fecha) {
          const fecha = new Date(reunion.fecha);
          const dayOfWeek = fecha.getDay(); // 0=Sunday, 1=Monday...
          const hour = fecha.getHours();
          
          // Convertir día de la semana (1-5 = Lunes-Viernes)
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const dayIndex = dayOfWeek - 1;
            // Asumir horas 8-14 como horas 1-6
            const hourIndex = hour - 8;
            
            if (hourIndex >= 0 && hourIndex < 6) {
              let color = '';
              switch (reunion.estado) {
                case 'pendiente':
                  color = 'status-pending';
                  break;
                case 'aceptada':
                  color = 'status-approved';
                  break;
                case 'denegada':
                  color = 'status-rejected';
                  break;
                case 'conflicto':
                  color = 'status-conflict';
                  break;
              }

              this.timeTable[hourIndex][dayIndex] = {
                text: 'BILERA', 
                subtext: reunion.titulo || 'Izenbururik gabe',
                type: 'meeting',
                colorClass: color,
              };
            }
          }
        }
      });
    });
  }
}
