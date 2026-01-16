import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { HorariosService, Horario, WeekDay } from '../../services/schedule';
import { ReunionesService, Reunion } from '../../services/meetings';
import { UsersService, User } from '../../services/users';
import { MatriculacionesService, Matriculacion } from '../../services/matriculaciones';

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
  myMatriculacion: Matriculacion | null = null;

  // Estadísticas
  pendingCount: number = 0;
  acceptedCount: number = 0;
  teacherCount: number = 0;

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
    private usersService: UsersService,
    private matriculacionesService: MatriculacionesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    console.log('HomeStudent - currentUser:', this.currentUser);
    this.initializeEmptyTable();
    this.loadTeachers();
    this.loadSchedule(); // Siempre cargar horarios generales

    if (this.currentUser && this.currentUser.id) {
      this.loadMyReuniones();
    }
  }

  loadMatriculacion() {
    console.log('loadMatriculacion - userId:', this.currentUser.id);
    // Cargar la matriculación del alumno para obtener su ciclo
    this.matriculacionesService.getMatriculacionesAlumno(this.currentUser.id).subscribe(matriculaciones => {
      console.log('Matriculaciones:', matriculaciones);
      if (matriculaciones.length > 0) {
        this.myMatriculacion = matriculaciones[0]; // Usar la más reciente
        this.loadScheduleByCiclo(this.myMatriculacion.ciclo_id);
      } else {
        // Si no hay matriculación, cargar horarios generales
        this.loadSchedule();
      }
    });
  }

  loadTeachers() {
    // Cargar profesores (tipo_id = 3)
    this.usersService.getUsersByTipo(3).subscribe(teachers => {
      console.log('Teachers loaded:', teachers);
      this.teachers = teachers;
      this.teacherCount = teachers.length;
      this.cdr.detectChanges();
    });
  }

  loadMyReuniones() {
    console.log('loadMyReuniones - userId:', this.currentUser.id);
    this.reunionesService.getReunionesAlumno(this.currentUser.id).subscribe(reuniones => {
      console.log('Reuniones loaded:', reuniones);
      this.myReuniones = reuniones;
      this.pendingCount = reuniones.filter(r => r.estado === 'pendiente').length;
      this.acceptedCount = reuniones.filter(r => r.estado === 'aceptada').length;
      this.cdr.detectChanges();
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
    // Los alumnos ven el horario general
    console.log('loadSchedule - calling API');
    this.horariosService.getHorarios().subscribe(horarios => {
      console.log('Horarios loaded:', horarios);
      this.fillTimeTable(horarios);
      this.cdr.detectChanges();
    });
  }

  loadScheduleByCiclo(cicloId: number) {
    // Cargar horarios del ciclo del alumno
    this.horariosService.getHorarioCiclo(cicloId).subscribe(horarios => {
      this.fillTimeTable(horarios);
      this.cdr.detectChanges();
    });
  }

  fillTimeTable(horarios: Horario[]) {
    horarios.forEach(horario => {
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
    this.cdr.detectChanges();
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