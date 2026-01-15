import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users';
import { MeetingsService } from '../../services/meetings';

@Component({
  selector: 'app-home-god',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-god.html',
  styleUrls: ['./home-god.css']
})
export class HomeGod implements OnInit {
  
  studentCount: number = 0;
  teacherCount: number = 0;
  todayMeetings: number = 0;

  constructor(
    private usersService: UsersService,
    private meetingsService: MeetingsService
  ) {}

  ngOnInit() {
    const allUsers = this.usersService.getUsers();

    this.studentCount = allUsers.filter(u => u.role === 'student').length;

    this.teacherCount = allUsers.filter(u => u.role === 'teacher').length;

    this.todayMeetings = this.meetingsService.getTodayMeetingsCount();
  }
}