import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { HorariosService, Horario, WeekDay } from '../../services/schedule';
import { ReunionesService, Reunion } from '../../services/meetings';
import { UsersService, User } from '../../services/users';
import { MatriculacionesService, Matriculacion } from '../../services/matriculaciones';
import { CentroSelector } from '../../shared/centro-selector/centro-selector';
import { Centro } from '../../services/centros';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-home-student',
  standalone: true,
  imports: [CommonModule, FormsModule, CentroSelector, TranslatePipe],
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

  pendingCount: number = 0;
  acceptedCount: number = 0;
  teacherCount: number = 0;

  showRequestForm: boolean = false;
  showCentroSelector: boolean = false;
  selectedCentro: Centro | null = null;
  newReunion: Partial<Reunion> = {
    titulo: '',
    asunto: '',
    profesor_id: 0,
    id_centro: '15112' // Elorrieta por defecto
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
    this.initializeEmptyTable();
    this.loadTeachers();
    this.loadSchedule();

    if (this.currentUser && this.currentUser.id) {
      this.loadMyReuniones();
    }
  }

  loadMatriculacion() {
    this.matriculacionesService.getMatriculacionesAlumno(this.currentUser.id).subscribe(matriculaciones => {
      if (matriculaciones.length > 0) {
        this.myMatriculacion = matriculaciones[0];
        this.loadScheduleByCiclo(this.myMatriculacion.ciclo_id);
      } else {
        this.loadSchedule();
      }
    });
  }

  loadTeachers() {
    this.usersService.getUsersByTipo(3).subscribe(teachers => {
      this.teachers = teachers;
      this.teacherCount = teachers.length;
      this.cdr.detectChanges();
    });
  }

  loadMyReuniones() {
    this.reunionesService.getReunionesAlumno(this.currentUser.id).subscribe(reuniones => {
      this.myReuniones = reuniones;
      this.pendingCount = reuniones.filter(r => r.estado === 'pendiente').length;
      this.acceptedCount = reuniones.filter(r => r.estado === 'aceptada').length;
      this.cdr.detectChanges();
    });
  }

  toggleForm() {
    this.showRequestForm = !this.showRequestForm;
    this.cdr.detectChanges();
  }

  toggleCentroSelector() {
    this.showCentroSelector = !this.showCentroSelector;
    this.cdr.detectChanges();
  }

  onCentroSelected(centro: Centro) {
    this.selectedCentro = centro;
    this.newReunion.id_centro = centro.CCODIGO;
    this.showCentroSelector = false;
    this.cdr.detectChanges();
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
      id_centro: this.newReunion.id_centro || '15112'
    };

    this.reunionesService.createReunion(reunion).subscribe(result => {
      if (result) {
        alert('Eskaera bidalita! (Solicitud enviada)');
        this.showRequestForm = false;
        this.showCentroSelector = false;
        this.selectedCentro = null;
        this.loadMyReuniones(); 
        this.newReunion = { titulo: '', asunto: '', profesor_id: 0, id_centro: '15112' };
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
    this.horariosService.getHorarios().subscribe(horarios => {
      this.fillTimeTable(horarios);
      this.cdr.detectChanges();
    });
  }

  loadScheduleByCiclo(cicloId: number) {
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