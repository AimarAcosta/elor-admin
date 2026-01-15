import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ScheduleService } from '../../services/schedule';
import { MeetingsService } from '../../services/meetings';

@Component({
  selector: 'app-home-teacher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-teacher.html',
  styleUrls: ['./home-teacher.css'],
})
export class HomeTeacher implements OnInit {
  timeTable: any[][] = [];

  days = ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES'];

  daysEus = ['ASTELEHENA', 'ASTEARTEA', 'ASTEAZKENA', 'OSTEGUNA', 'OSTIRALA'];

  hours = [1, 2, 3, 4, 5, 6];
  currentUser: any;

  constructor(
    private authService: AuthService,
    private scheduleService: ScheduleService,
    private meetingsService: MeetingsService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getUser();
    this.initializeEmptyTable();
    if (this.currentUser) {
      this.loadScheduleData(this.currentUser.id);
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
    this.scheduleService.getScheduleByTeacher(userId).subscribe((classes) => {
      classes.forEach((cls) => {
        const dayIndex = this.days.indexOf(cls.dia);
        const hourIndex = cls.hora - 1;

        if (dayIndex >= 0 && hourIndex >= 0) {
          this.timeTable[hourIndex][dayIndex] = {
            text: cls.modulo_nombre,
            subtext: cls.aula,
            type: 'class',
            colorClass: 'bg-light',
          };
        }
      });

      this.meetingsService.getMeetings().subscribe((meetings) => {
        const myMeetings = meetings.filter((m) => m.profesor_id === userId);

        myMeetings.forEach((meeting) => {
          let dayIndex = -1;
          let hourIndex = -1;
          if (meeting.id_reunion === 1) {
            dayIndex = 0;
            hourIndex = 0;
          }

          if (dayIndex >= 0 && hourIndex >= 0) {
            let color = '';
            switch (meeting.estado) {
              case 'pendiente':
                color = 'bg-warning text-dark';
                break;
              case 'aceptada':
                color = 'bg-success text-white';
                break;
              case 'denegada':
                color = 'bg-danger text-white';
                break;
              case 'conflicto':
                color = 'bg-secondary text-white';
                break;
            }

            this.timeTable[hourIndex][dayIndex] = {
              text: 'BILERA', 
              subtext: meeting.titulo || 'Izenbururik gabe',
              type: 'meeting',
              colorClass: color,
            };
          }
        });
      });
    });
  }
}
