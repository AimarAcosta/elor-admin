import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ScheduleService } from '../../services/schedule';
import { MeetingsService, Meeting } from '../../services/meetings';
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
  days = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES']; // Para mapear datos
  
  currentUser: any;
  myMeetings: Meeting[] = [];
  teachers: User[] = []; 

  showRequestForm: boolean = false;
  newMeeting: Partial<Meeting> = {
    titulo: '',
    asunto: '',
    profesor_id: 0
  };

  constructor(
    private authService: AuthService,
    private scheduleService: ScheduleService,
    private meetingsService: MeetingsService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.initializeEmptyTable();
    this.loadTeachers();

    if (this.currentUser) {
      this.loadSchedule();
      this.loadMyMeetings();
    }
  }

  loadTeachers() {
    this.teachers = this.usersService.getUsers().filter(u => u.role === 'teacher');
  }

  loadMyMeetings() {
    this.meetingsService.getMeetings().subscribe(all => {
      this.myMeetings = all.filter(m => m.alumno_id === this.currentUser.id);
    });
  }

  toggleForm() {
    this.showRequestForm = !this.showRequestForm;
  }

  submitRequest() {
    if (!this.newMeeting.profesor_id || !this.newMeeting.titulo) {
      alert('Mesedez, bete eremu guztiak (Rellena todo)');
      return;
    }

    const meeting: Meeting = {
      id_reunion: 0, 
      estado: 'pendiente',
      fecha: new Date(), 
      titulo: this.newMeeting.titulo,
      asunto: this.newMeeting.asunto,
      profesor_id: Number(this.newMeeting.profesor_id),
      alumno_id: this.currentUser.id
    };

    this.meetingsService.addMeeting(meeting);
    
    alert('Eskaera bidalita! (Solicitud enviada)');
    this.showRequestForm = false;
    this.loadMyMeetings(); 
    
    this.newMeeting = { titulo: '', asunto: '', profesor_id: 0 };
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
    this.scheduleService.getScheduleByStudent(this.currentUser.id).subscribe(classes => {
      classes.forEach(cls => {
        const dayIndex = this.days.indexOf(cls.dia);
        const hourIndex = cls.hora - 1;
        
        if (dayIndex >= 0 && hourIndex >= 0) {
          this.timeTable[hourIndex][dayIndex] = {
            text: cls.modulo_nombre,
            subtext: cls.aula,
            colorClass: 'bg-info text-white' 
          };
        }
      });
    });
  }
}