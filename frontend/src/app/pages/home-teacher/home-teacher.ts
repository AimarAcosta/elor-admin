import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { HorariosService, Horario, WeekDay } from '../../services/schedule';
import { ReunionesService, Reunion } from '../../services/meetings';

@Component({
  selector: 'app-home-teacher',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  pendingReuniones: Reunion[] = [];

  // Estadísticas
  totalReuniones: number = 0;
  pendingCount: number = 0;
  acceptedCount: number = 0;
  classCount: number = 0;

  constructor(
    private authService: AuthService,
    private horariosService: HorariosService,
    private reunionesService: ReunionesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    console.log('HomeTeacher - currentUser:', this.currentUser);
    this.initializeEmptyTable();
    
    // Cargar datos aunque no haya usuario (para debug)
    if (this.currentUser && this.currentUser.id) {
      this.loadScheduleData(this.currentUser.id);
      this.loadReuniones(this.currentUser.id);
    } else {
      console.log('No currentUser.id, loading all horarios');
      this.loadAllHorarios();
    }
  }

  loadAllHorarios() {
    this.horariosService.getHorarios().subscribe((horarios) => {
      console.log('All horarios loaded:', horarios);
      this.classCount = horarios.length;
    });
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
    console.log('loadScheduleData - userId:', userId);
    this.horariosService.getHorarioProfesor(userId).subscribe((horarios) => {
      console.log('Horarios loaded:', horarios);
      this.classCount = horarios.length;
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
      this.cdr.detectChanges();
    });
  }

  loadReuniones(profesorId: number) {
    console.log('loadReuniones - profesorId:', profesorId);
    this.reunionesService.getReunionesProfesor(profesorId).subscribe((reuniones) => {
      console.log('Reuniones loaded:', reuniones);
      this.myReuniones = reuniones;
      this.totalReuniones = reuniones.length;
      this.pendingReuniones = reuniones.filter(r => r.estado === 'pendiente');
      this.pendingCount = this.pendingReuniones.length;
      this.acceptedCount = reuniones.filter(r => r.estado === 'aceptada').length;
      this.cdr.detectChanges();
      
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

  acceptReunion(reunion: Reunion) {
    this.reunionesService.updateReunion(reunion.id_reunion, { estado: 'aceptada' }).subscribe(() => {
      this.loadReuniones(this.currentUser.id);
      alert('Bilera onartuta! (Reunión aceptada)');
    });
  }

  rejectReunion(reunion: Reunion) {
    this.reunionesService.updateReunion(reunion.id_reunion, { estado: 'denegada' }).subscribe(() => {
      this.loadReuniones(this.currentUser.id);
      alert('Bilera ezeztatuta (Reunión rechazada)');
    });
  }

  getEstadoEus(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'Onartzeke';
      case 'aceptada': return 'Onartuta';
      case 'denegada': return 'Ezeztatuta';
      case 'conflicto': return 'Gatazka';
      default: return estado;
    }
  }
}
