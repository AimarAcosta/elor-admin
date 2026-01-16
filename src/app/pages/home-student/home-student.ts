import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { HorariosService, Horario, WeekDay } from '../../services/schedule';
import { ReunionesService, Reunion } from '../../services/meetings';
import { UsersService, User } from '../../services/users';

@Component({
  selector: 'app-home-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home-student.html',
  styleUrls: ['./home-student.css']
})
export class HomeStudent implements OnInit {

  timeTable: any[][] = [];
  daysEus = ['ASTELEHENA', 'ASTEARTEA', 'ASTEAZKENA', 'OSTEGUNA', 'OSTIRALA'];
  days: WeekDay[] = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];
  
  currentUser: any;
  myReuniones: Reunion[] = [];
  teachers: User[] = []; 

  showRequestForm: boolean = false;
  newReunion: Partial<Reunion> = {
    titulo: '',
    asunto: '',
    profesor_id: 0
  };

  constructor(
    private authService: AuthService,
    private horariosService: HorariosService,
    private reunionesService: ReunionesService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.initializeEmptyTable();
    this.loadTeachers();

    if (this.currentUser) {
      this.loadSchedule();
      this.loadMyReuniones();
    }
  }

  loadTeachers() {
    // Cargar profesores (tipo_id = 3)
    this.usersService.getUsersByTipo(3).subscribe(teachers => {
      this.teachers = teachers;
    });
  }

  loadMyReuniones() {
    this.reunionesService.getReunionesAlumno(this.currentUser.id).subscribe(reuniones => {
      this.myReuniones = reuniones;
    });
  }

  toggleForm() {
    this.showRequestForm = !this.showRequestForm;
  }

  submitRequest() {
    if (!this.newReunion.profesor_id || !this.newReunion.titulo) {
      alert('Mesedez, bete eremu guztiak (Rellena todo)');
      return;
    }

    const reunion: Partial<Reunion> = {
      estado: 'pendiente',
      fecha: new Date(), 
      titulo: this.newReunion.titulo,
      asunto: this.newReunion.asunto,
      profesor_id: Number(this.newReunion.profesor_id),
      alumno_id: this.currentUser.id,
      id_centro: '15112' // Centro por defecto
    };

    this.reunionesService.createReunion(reunion).subscribe(result => {
      if (result) {
        alert('Eskaera bidalita! (Solicitud enviada)');
        this.showRequestForm = false;
        this.loadMyReuniones(); 
        this.newReunion = { titulo: '', asunto: '', profesor_id: 0 };
      } else {
        alert('Errorea eskaria bidaltzean (Error al enviar)');
      }
    });
  }

  initializeEmptyTable() {
    for (let h = 0; h < 6; h++) {
      this.timeTable[h] = [];
      for (let d = 0; d < 5; d++) {
        this.timeTable[h][d] = { text: '', colorClass: '' };
      }
    }
  }

  loadSchedule() {
    // Los alumnos ven el horario general (TODO: filtrar por matriculación)
    this.horariosService.getHorarios().subscribe(horarios => {
      // Por ahora mostramos todos los horarios del aula B101 como ejemplo
      const studentHorarios = horarios.filter(h => h.aula === 'Aula B101');
      
      studentHorarios.forEach(horario => {
        const dayIndex = this.days.indexOf(horario.dia);
        const hourIndex = horario.hora - 1;
        
        if (dayIndex >= 0 && hourIndex >= 0 && hourIndex < 6) {
          const moduloNombre = horario.modulo?.nombre_eus || horario.modulo?.nombre || 'Modulua';
          this.timeTable[hourIndex][dayIndex] = {
            text: moduloNombre,
            subtext: horario.aula || '',
            colorClass: 'bg-info text-white' 
          };
        }
      });
    });
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'pendiente': return 'badge bg-warning text-dark';
      case 'aceptada': return 'badge bg-success';
      case 'denegada': return 'badge bg-danger';
      case 'conflicto': return 'badge bg-secondary';
      default: return 'badge bg-secondary';
    }
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